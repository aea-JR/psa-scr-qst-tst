import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { normalizeAccept, isTypeAllowed, convertToFileItem, getFileExtension, filterBySize, dedupeAgainst, createTempItems, mergeUniqueByTitle } from "../Widgets/FileWidget/fileUtils";
import { useAnswer } from "./useAnswer";
import { useFormContext } from "../contexts/FormContext";
import { FileItem } from "../types/types";
import { getDocumentDataClass } from "../Data/Document/DocumentDataClass";
import { blobToBinary } from "../Widgets/FileWidget/blobToBinary";
import generateId from "../utils/idGenerator";
import { load } from "scrivito";

export const useFiles = (
  questionId: string,
  { multiple, maxSizeMB, accept }: { multiple: boolean; maxSizeMB: number; accept?: string },
  onAfterChange?: (nextNames: string[]) => void,
) => {
  const DocumentDataClass = getDocumentDataClass()!;
  const [files, setFiles] = useState<FileItem[]>([]);
  const [sizeRejected, setSizeRejected] = useState<string[]>([]);
  const [typeRejected, setTypeRejected] = useState<string[]>([]);

  const { idns, handleChange } = useAnswer(questionId, [])
  const formCtx = useFormContext();


  useEffect(() => {
    // For existing identifiers, show placeholders immediately and resolve progressively
    const ids = idns || [];
    if (!ids.length) {
      setFiles([]);
      return;
    }

    let cancelled = false;
    // Preserve already-ready items to avoid flicker; placeholders for the rest
    const idsSet = new Set(ids);
    const readyById = new Map(files.filter(f => f.status === "ready" && idsSet.has(f.id)).map(f => [f.id, f] as const));
    const initialList: FileItem[] = ids.map((id) => readyById.get(id) || { id, title: "loading...", type: "", status: "loading" });
    setFiles(initialList);

    const run = async () => {
      for (const id of ids) {
        if (cancelled || readyById.has(id)) continue;
        const doc = await load(() => DocumentDataClass.get(id));
        if (cancelled) return;
        if (doc) {
          const readyItem = convertToFileItem([doc])[0];
          setFiles(prev => prev.map(it => (it.id === id ? readyItem : it)));
        } else {
          setFiles(prev => prev.map(it => (it.id === id ? { ...it, status: "error", title: "Something went wrong while loading the file" } : it)));
          console.warn("Something went wrong while trying to get document with GID: ", id);
        }
      }
    };

    run();
    return () => { cancelled = true; };
  }, [idns])


  const fileNames = useMemo(() => new Set((files).map(f => (f.title || "").toLowerCase())), [files]);

  // Replace a temp file item in local state when its upload completes
  const replaceLocalById = (id: string, replacement: FileItem) => {
    setFiles(prev => prev.map(it => (it.id === id ? replacement : it)));
  };

  // Create an array of FileItems deduplicated by id, keeping last occurrence
  const uniqueById = (items: FileItem[]) => Array.from(new Map(items.map(it => [it.id, it])).values());

  // Prepare selection: validate types/sizes, compute accepted, temps, and nextNames
  const stageSelection = (input: File[]) => {
    const acc = normalizeAccept(accept);
    const allowedByType = input.filter((f) => isTypeAllowed(f, acc));
    const rejectedByType = input.filter((f) => !isTypeAllowed(f, acc)).map(f => f.name);
    const maxBytes = maxSizeMB * 1024 * 1024;
    const { accepted: sizeAccepted, rejected: rejectedBySize } = filterBySize(allowedByType, maxBytes);

    let accepted = dedupeAgainst(fileNames, sizeAccepted);
    if (!multiple) accepted = accepted.slice(0, 1);

    const acceptedNames = accepted.map((f) => f.name.toLowerCase());
    const nextNames = multiple
      ? Array.from(new Set([...(fileNames || []), ...acceptedNames]))
      : acceptedNames.slice(0, 1);

    const temps = createTempItems(accepted);
    return { accepted, temps, nextNames, rejectedByType, rejectedBySize };
  };

  // Build final answer payload from existing + uploaded ready items
  const buildAnswerFromUploads = (existing: FileItem[], uploaded: FileItem[]) => {
    const existingReady = (existing || []).filter((i) => i.status === "ready");
    const newlyReady = uploaded.filter((i) => i.status === "ready");

    let finalReady: FileItem[];
    if (multiple) {
      finalReady = uniqueById([...existingReady, ...newlyReady]);
    } else {
      finalReady = newlyReady.length
        ? [newlyReady[newlyReady.length - 1]]
        : (existingReady.length ? [existingReady[existingReady.length - 1]] : []);
    }
    const values = finalReady.map(i => i.title);
    const identifiers = finalReady.map(i => i.id);
    return { values, identifiers };
  };


  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);

    // Stage selection and update local rejects
    const { accepted, temps, nextNames, rejectedByType, rejectedBySize } = stageSelection(list);
    setTypeRejected(rejectedByType);
    setSizeRejected(rejectedBySize);

    // Optimistically add temps to UI
    const base = multiple ? files : [];
    setFiles(mergeUniqueByTitle([...base, ...temps]));

    // Upload and then update answer from ready items
    if (accepted.length > 0) {
      formCtx?.beginUpload(accepted.length);
    }
    try {
      const uploaded = await uploadFiles(accepted, temps);
      const { values, identifiers } = buildAnswerFromUploads(files, uploaded);
      handleChange(values, identifiers);
    } finally {
      if (accepted.length > 0) {
        formCtx?.finishUpload(accepted.length);
      }
    }

    if (onAfterChange) onAfterChange(nextNames);
    e.target.value = ""; // reset input
  };

  // local remove only, backend takes care of deletion
  const removeFile = (id: string) => {
    // Compute remaining list and names for UI
    const remaining = (id ? files.filter(f => f.id !== id) : files);
    const nextNames = remaining.map(f => f.title);

    // Update local UI state
    setFiles(remaining);
    setSizeRejected([]);
    setTypeRejected([]);

    // Update answer (values + identifiers) from remaining ready files
    const readyRemaining = remaining.filter(f => f.status === "ready");
    const finalReady = multiple
      ? readyRemaining
      : (readyRemaining.length ? [readyRemaining[readyRemaining.length - 1]] : []);
    const values = finalReady.map(i => i.title);
    const identifiers = finalReady.map(i => i.id);
    handleChange(values, identifiers);

    if (onAfterChange) onAfterChange(nextNames);
  };


  const uploadOne = async (f: File): Promise<FileItem> => {
    try {
      const binary = await blobToBinary(f);
      const document = await DocumentDataClass!.create({ ...binary });
      const fileItem = convertToFileItem([document])[0];

      return fileItem;
    } catch (_e) {
      return { id: `tmp_${generateId()}`, title: f.name, type: f.type || getFileExtension(f.name), status: "error" };
    }
  };

  const uploadFiles = async (files: File[], temps: FileItem[]) => {

    const results: FileItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempId = temps[i].id!;
      const result = await uploadOne(file);
      results.push(result);

      replaceLocalById(tempId, result);
    }
    return results;
  };

  return { files, names: fileNames, sizeRejected, typeRejected, onInputChange, removeFile };
};
