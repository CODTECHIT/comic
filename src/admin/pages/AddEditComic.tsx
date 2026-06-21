import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImageUploadZone } from "../components/ImageUploadZone";
import { PageReorderList } from "../components/PageReorderList";

const comicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  synopsis: z.string().min(10, "Synopsis must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  audience: z.enum(["all", "kids", "adults"]),
  price: z.coerce.number().min(0, "Price must be positive"),
  coverImage: z.string().min(1, "Cover image is required"),
  pages: z.array(z.string()).min(1, "At least one comic page is required"),
  status: z.enum(["published", "draft"]),
});

type ComicFormValues = z.infer<typeof comicSchema>;

export function AddEditComic() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ComicFormValues>({
    resolver: zodResolver(comicSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      synopsis: "",
      category: "",
      audience: "all",
      price: 0,
      coverImage: "",
      pages: [],
      status: "draft",
    },
  });

  const onSubmit = async (data: ComicFormValues, status: "published" | "draft") => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call
      console.log("Saving comic:", { ...data, status });
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/admin/comics");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/comics" className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Add New Comic</h1>
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
              <label className="block text-sm font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
              <select 
                {...register("category")} 
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500 bg-white ${errors.category ? 'border-red-500' : 'border-slate-300'}`}
              >
                <option value="">Select category...</option>
                <option value="mythic">Mythic Warriors</option>
                <option value="urban">Urban Heroes</option>
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
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button 
            type="button" 
            onClick={() => navigate("/admin/comics")}
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
