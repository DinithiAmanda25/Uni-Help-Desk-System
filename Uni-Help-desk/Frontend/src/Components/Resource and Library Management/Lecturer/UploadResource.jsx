import { useState, useRef } from "react";
import { Upload, FileText, Tag, Globe, Lock, Users, X, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { resourceAPI } from "../../../services/api";

const categories = ["Computer Science", "Web Development", "Data Science", "Software Engineering", "Mathematics", "Physics", "Biology", "Business"];
const accessLevels = [
  { value: "public",  label: "Public",     desc: "Accessible by all students",  icon: Globe, color: "text-emerald-500" },
  { value: "private", label: "Private",    desc: "Only visible to you",          icon: Lock,  color: "text-gray-500"   },
  { value: "role",    label: "Role-based", desc: "Specific student groups",     icon: Users, color: "text-blue-500"   },
];

const ALLOWED_TYPES = ["application/pdf", "application/epub+zip",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "video/mp4", "video/webm",
];
const MAX_SIZE_MB = 500;
const VERSION_RE = /^\d+\.\d+(\.\d+)?$/;

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
      <AlertCircle size={11} /> {msg}
    </p>
  );
}

export default function UploadResource() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    accessLevel: "public",
    tags: [],
    version: "1.0",
  });
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  // ── Tag helpers ──
  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (form.tags.includes(t)) { toast.error("Tag already added"); return; }
    if (form.tags.length >= 8) { toast.error("Maximum 8 tags allowed"); return; }
    setForm({ ...form, tags: [...form.tags, t] });
    setTagInput("");
  };
  const removeTag = (tag) => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });

  // ── File handler ──
  const handleFile = (f) => {
    if (!f) return;
    const newErrs = { ...errors };
    if (!ALLOWED_TYPES.includes(f.type)) {
      newErrs.file = "Unsupported file type. Allowed: PDF, EPUB, PPT, DOC, MP4, WEBM.";
      setErrors(newErrs);
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      newErrs.file = `File is too large. Maximum allowed size is ${MAX_SIZE_MB} MB.`;
      setErrors(newErrs);
      return;
    }
    delete newErrs.file;
    setErrors(newErrs);
    setFile(f);
  };

  // ── Validation ──
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) {
      errs.title = "Title is required.";
    } else if (form.title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters.";
    } else if (form.title.trim().length > 120) {
      errs.title = "Title must not exceed 120 characters.";
    }

    if (form.description.trim().length > 0 && form.description.trim().length < 10) {
      errs.description = "Description must be at least 10 characters if provided.";
    }

    if (!form.category) {
      errs.category = "Please select a category.";
    }

    if (form.version && !VERSION_RE.test(form.version.trim())) {
      errs.version = "Version must be in the format 1.0 or 1.0.0";
    }

    if (!file) {
      errs.file = "Please select a file to upload.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const clearError = (key) => {
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("category", form.category);
      formData.append("accessLevel", form.accessLevel);
      formData.append("version", form.version.trim());
      formData.append("tags", form.tags.join(","));
      await resourceAPI.upload(formData);
      setUploading(false);
      setUploaded(true);
      toast.success("Resource uploaded successfully!");
    } catch (err) {
      setUploading(false);
      toast.error(err.message || "Upload failed. Are you logged in as a lecturer?");
    }
  };

  // ── Success screen ──
  if (uploaded) {
    return (
      <div className="px-6 py-6 max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Upload Successful!</h2>
          <p className="text-sm text-gray-500 mb-6">"{form.title}" has been uploaded and is now {form.accessLevel === "public" ? "visible to all students" : form.accessLevel === "private" ? "private" : "restricted by role"}.</p>
          <button
            onClick={() => { setUploaded(false); setFile(null); setErrors({}); setForm({ title: "", description: "", category: "", accessLevel: "public", tags: [], version: "1.0" }); }}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-2.5 rounded-xl transition-all text-sm"
          >
            Upload Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Upload Resource</h1>
        <p className="text-sm text-gray-400 mt-1">Share educational materials with your students</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* File drop zone */}
        <div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              errors.file ? "border-red-400 bg-red-50" :
              dragOver ? "border-violet-400 bg-violet-50" :
              file ? "border-emerald-400 bg-emerald-50" :
              "border-gray-200 hover:border-violet-300 hover:bg-violet-50/50"
            }`}
          >
            <input ref={fileRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files[0])} accept=".pdf,.epub,.ppt,.pptx,.doc,.docx,.mp4,.webm" />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileText size={36} className="text-emerald-500" />
                <p className="font-semibold text-emerald-700">{file.name}</p>
                <p className="text-xs text-emerald-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); clearError("file"); }} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 mt-1"><X size={12} /> Remove file</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 rounded-2xl ${dragOver ? "bg-violet-100" : "bg-gray-100"} flex items-center justify-center mb-1`}>
                  <Upload size={28} className={dragOver ? "text-violet-500" : "text-gray-400"} />
                </div>
                <p className="font-semibold text-gray-700">Drop your file here or <span className="text-violet-500">browse</span></p>
                <p className="text-xs text-gray-400">PDF, EPUB, PPT, DOC, Video (max {MAX_SIZE_MB} MB)</p>
              </div>
            )}
          </div>
          <FieldError msg={errors.file} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
            <input
              value={form.title}
              onChange={(e) => { setForm({ ...form, title: e.target.value }); clearError("title"); }}
              placeholder="e.g. Introduction to Machine Learning"
              maxLength={120}
              className={`w-full px-4 py-3 text-sm bg-gray-50 border rounded-xl outline-none transition-all ${errors.title ? "border-red-400 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-violet-300"}`}
            />
            <div className="flex justify-between items-start mt-1">
              <FieldError msg={errors.title} />
              <span className={`text-[10px] ml-auto ${form.title.length > 100 ? "text-orange-400" : "text-gray-400"}`}>{form.title.length}/120</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => { setForm({ ...form, description: e.target.value }); clearError("description"); }}
              placeholder="Briefly describe the content and what students will learn..."
              rows={3}
              className={`w-full px-4 py-3 text-sm bg-gray-50 border rounded-xl outline-none transition-all resize-none ${errors.description ? "border-red-400 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-violet-300"}`}
            />
            <FieldError msg={errors.description} />
          </div>

          {/* Category + Version */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
              <select
                value={form.category}
                onChange={(e) => { setForm({ ...form, category: e.target.value }); clearError("category"); }}
                className={`w-full px-4 py-3 text-sm bg-gray-50 border rounded-xl outline-none transition-all ${errors.category ? "border-red-400 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-violet-300"}`}
              >
                <option value="">Select category</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <FieldError msg={errors.category} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Version</label>
              <input
                value={form.version}
                onChange={(e) => { setForm({ ...form, version: e.target.value }); clearError("version"); }}
                placeholder="e.g. 1.0"
                className={`w-full px-4 py-3 text-sm bg-gray-50 border rounded-xl outline-none transition-all ${errors.version ? "border-red-400 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-violet-300"}`}
              />
              <FieldError msg={errors.version} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags <span className="text-gray-400 font-normal text-xs">(max 8)</span></label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-violet-50 text-violet-600 text-xs font-medium px-3 py-1 rounded-full border border-violet-200">
                  <Tag size={10} /> {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 hover:text-red-500"><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag (press Enter)"
                className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-violet-300 transition-all"
              />
              <button type="button" onClick={addTag} className="px-4 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-xl text-sm font-medium transition-all flex items-center gap-1 border border-violet-200">
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Access Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Access Level</label>
            <div className="grid grid-cols-3 gap-3">
              {accessLevels.map(({ value, label, desc, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, accessLevel: value })}
                  className={`p-4 rounded-xl border text-left transition-all ${form.accessLevel === value ? "border-violet-400 bg-violet-50" : "border-gray-200 bg-gray-50 hover:border-violet-200"}`}
                >
                  <Icon size={18} className={`${color} mb-2`} />
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {uploading
            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>
            : <><Upload size={18} /> Upload Resource</>
          }
        </button>
      </form>
    </div>
  );
}
