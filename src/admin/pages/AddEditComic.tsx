import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImageUploadZone } from "../components/ImageUploadZone";
import { PageReorderList } from "../components/PageReorderList";
import { PdfUploadZone } from "../components/PdfUploadZone";
import { API_URL } from "../../config/api";
import { fetchApi } from "../../lib/apiClient";

const comicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  synopsis: z.string().min(10, "Synopsis must be at least 10 characters"),
  creator: z.string().min(1, "Creator is required"),
  issuesInfo: z.string().min(1, "Issues Info is required"),
  pageCount: z.string().min(1, "Page Count is required"),
  category: z.string().min(1, "Category is required"),
  audience: z.enum(["all", "kids", "adults"]),
  price: z.coerce.number().min(0, "Price must be positive"),
  coverImage: z.string().min(1, "Cover image is required"),
  pages: z.array(z.string()).min(1, "At least one comic page is required"),
  pdfUrl: z.string().optional(),
  status: z.enum(["published", "draft"]),
});

type ComicFormValues = z.infer<typeof comicSchema>;

export function AddEditComic({ id: propId }: any) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const isEditMode = !!id;

  useEffect(() => {
    fetchApi(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to fetch categories:", err));
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ComicFormValues>({
    resolver: zodResolver(comicSchema) as any,
    defaultValues: {
      title: "",
      subtitle: "",
      synopsis: "",
      creator: "Lekhyas Studio",
      issuesInfo: "March, June, Sep",
      pageCount: "48 avg",
      category: "",
      audience: "all",
      price: 0,
      coverImage: "",
      pages: [],
      pdfUrl: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (id) {
      fetchApi(`${API_URL}/comics/${id}`)
        .then(res => res.json())
        .then(data => {
          reset({
            title: data.title || "",
            subtitle: data.subtitle || "",
            synopsis: data.synopsis || "",
            creator: data.creator || "Lekhyas Studio",
            issuesInfo: data.issuesInfo || "",
            pageCount: data.pageCount || "",
            category: data.category || "",
            audience: data.audience || "all",
            price: data.price || 0,
            coverImage: data.coverImage || "",
            pages: data.pages || [],
            pdfUrl: data.pdfUrl || "",
            status: data.status || "draft",
          });
        })
        .catch(err => console.error("Failed to fetch comic:", err));
    }
  }, [id, reset]);

  const onSubmit = async (data: ComicFormValues, status: "published" | "draft") => {
    setIsSubmitting(true);
    try {
      const url = id 
        ? `${API_URL}/comics/${id}` 
        : `${API_URL}/comics`;
      
      const method = id ? "PUT" : "POST";

      const response = await fetchApi(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({ ...data, status }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save comic");
      }

      // If published and NOT in edit mode, optionally trigger an email notification
      if (status === "published" && !id) {
        try {
          await fetchApi(`${API_URL}/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: "admin@example.com", // Replace with real recipient logic
              subject: `New Comic Published: ${data.title}`,
              html: `<p>A new comic <strong>${data.title}</strong> has been successfully published to the platform.</p>`
            })
          });
        } catch (emailError) {
          console.error("Failed to send email notification", emailError);
        }
      }

      navigate("/admin/comic/comics");
    } catch (error) {
      console.error("Error saving comic:", error);
      alert("Failed to save comic. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/comic/comics" className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{isEditMode ? "Edit Comic" : "Add New Comic"}</h1>
      </div>

      <form className="space-y-8 bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Title <span className="text-red-500">*</span></label>
              <input 
                {...register("title")} 
                type="text" 
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500 ${errors.title ? 'border-red-500' : 'border-slate-300'}`} 
                placeholder="e.g. War-God: Son of Vayu" 
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Subtitle / Tagline</label>
              <input 
                {...register("subtitle")} 
                type="text" 
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500" 
                placeholder="e.g. War for Justice" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Synopsis <span className="text-red-500">*</span></label>
            <textarea 
              {...register("synopsis")} 
              rows={4} 
              className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500 ${errors.synopsis ? 'border-red-500' : 'border-slate-300'}`} 
              placeholder="Describe the comic story..." 
            />
            {errors.synopsis && <p className="text-red-500 text-xs mt-1">{errors.synopsis.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Creator <span className="text-red-500">*</span></label>
              <input 
                {...register("creator")} 
                type="text" 
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500 ${errors.creator ? 'border-red-500' : 'border-slate-300'}`} 
                placeholder="e.g. Lekhyas Studio" 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Issues Info <span className="text-red-500">*</span></label>
              <input 
                {...register("issuesInfo")} 
                type="text" 
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500 ${errors.issuesInfo ? 'border-red-500' : 'border-slate-300'}`} 
                placeholder="e.g. March, June, Sep" 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Page Count Info <span className="text-red-500">*</span></label>
              <input 
                {...register("pageCount")} 
                type="text" 
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500 ${errors.pageCount ? 'border-red-500' : 'border-slate-300'}`} 
                placeholder="e.g. 48 avg" 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
              <select 
                {...register("category")} 
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500 bg-white ${errors.category ? 'border-red-500' : 'border-slate-300'}`}
              >
                <option value="">Select category...</option>
                {categories.map((c: any) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Audience Tag</label>
              <select 
                {...register("audience")} 
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500 bg-white"
              >
                <option value="all">All Ages</option>
                <option value="kids">Kids</option>
                <option value="adults">Adults</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Price (₹) <span className="text-red-500">*</span></label>
              <input 
                {...register("price")} 
                type="number" 
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500 ${errors.price ? 'border-red-500' : 'border-slate-300'}`} 
                placeholder="e.g. 1499" 
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
          </div>
        </section>

        {/* Media Upload */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Media Upload</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-2">
              <Controller
                control={control}
                name="coverImage"
                render={({ field }) => (
                  <ImageUploadZone 
                    label="Cover Image *"
                    description="Upload Cover"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage.message}</p>}
            </div>

            <div className="col-span-2 space-y-2">
              <Controller
                control={control}
                name="pages"
                render={({ field }) => (
                  <div className="space-y-4 h-full">
                    <ImageUploadZone 
                      label="Comic Pages (Internal) *"
                      description="Drag & drop comic pages here"
                      multiple={true}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <PageReorderList pages={field.value} onChange={field.onChange} />
                  </div>
                )}
              />
              {errors.pages && <p className="text-red-500 text-xs mt-1">{errors.pages.message}</p>}
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100">
            <Controller
              control={control}
              name="pdfUrl"
              render={({ field }) => (
                <PdfUploadZone 
                  label="Comic PDF File (Optional)"
                  description="Upload full PDF version for buyers"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button 
            type="button" 
            onClick={() => navigate("/admin/comic/comics")}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button" 
            disabled={isSubmitting}
            onClick={handleSubmit((data) => onSubmit(data, "draft"))}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button 
            type="button" 
            disabled={isSubmitting}
            onClick={handleSubmit((data) => onSubmit(data, "published"))}
            className="bg-[#C8181E] hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            Publish Comic
          </button>
        </div>
      </form>
    </div>
  );
}
