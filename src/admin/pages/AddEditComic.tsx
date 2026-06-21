import { useState } from "react";
import { ChevronLeft, UploadCloud } from "lucide-react";
import { Link } from "react-router";

export function AddEditComic() {
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
              <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500" placeholder="e.g. War-God: Son of Vayu" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Subtitle / Tagline</label>
              <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500" placeholder="e.g. War for Justice" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Synopsis <span className="text-red-500">*</span></label>
            <textarea rows={4} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500" placeholder="Describe the comic story..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
              <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500">
                <option value="">Select category...</option>
                <option value="mythic">Mythic Warriors</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Audience Tag</label>
              <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500">
                <option value="all">All Ages</option>
                <option value="kids">Kids</option>
                <option value="adults">Adults</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Price (₹) <span className="text-red-500">*</span></label>
              <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500" placeholder="e.g. 1499" />
            </div>
          </div>
        </section>

        {/* Media Upload */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Media Upload</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-2">
              <label className="block text-sm font-medium text-slate-700">Cover Image</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer" style={{ aspectRatio: '2/3' }}>
                <UploadCloud className="text-slate-400 mb-2" size={32} />
                <span className="text-sm font-medium text-slate-700">Upload Cover</span>
                <span className="text-xs text-slate-500 mt-1">JPEG/PNG up to 5MB</span>
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="block text-sm font-medium text-slate-700">Comic Pages (Internal)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center h-full hover:bg-slate-50 transition-colors cursor-pointer min-h-[200px]">
                <UploadCloud className="text-slate-400 mb-2" size={32} />
                <span className="text-sm font-medium text-slate-700">Drag & drop comic pages here</span>
                <span className="text-xs text-slate-500 mt-1">Select multiple files (JPEG/PNG). They will be automatically watermarked by Cloudinary.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button type="button" className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="button" className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Save as Draft
          </button>
          <button type="submit" className="bg-[#C8181E] hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            Publish Comic
          </button>
        </div>
      </form>
    </div>
  );
}
