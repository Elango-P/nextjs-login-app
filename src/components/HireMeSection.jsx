// components/HireMeSection.jsx
"use client";

import { useState } from "react";
import { supabase } from "../../app/utils/supabaseClient";

// OPTIONAL — fake delay (keeps your 1.5s loading animation)
const simulateSubmission = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
};

export default function HireMeSection() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project_description: "",
    budget: "",
    timeline: "",
    attachment_url: ""
  });

  const [attachmentFile, setAttachmentFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'

  // 🟦 Handle text input
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status) setStatus(null);
  };

  // 🟩 Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAttachmentFile(file);
      setFormData({ ...formData, attachment_url: file.name });
      if (status) setStatus(null);

      // Show image preview only for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  // 🟥 MAIN FORM SUBMIT FUNCTION (supabase + upload + success UI)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.project_description) {
        throw new Error("Name, email, and project description are required.");
      }

      let finalPayload = { ...formData };

      // 🟧 Upload file if selected
      if (attachmentFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", attachmentFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) throw new Error("File upload failed");

        const uploadResult = await uploadResponse.json();
        finalPayload.attachment_url = uploadResult.url;
      }

      // 🟩 Insert into Supabase
      const { data: inserted, error } = await supabase
        .from("freelance_requests")
        .insert(finalPayload)
        .select()
        .single();

      if (error) throw error;

      // 🟦 Optional delay (smooth animation)
      await simulateSubmission();

      // Success UI
      setStatus("success");

      // Reset form
      setFormData({
        name: "",
        email: "",
        project_description: "",
        budget: "",
        timeline: "",
        attachment_url: ""
      });
      setAttachmentFile(null);
      setImagePreview(null);

    } catch (error) {
      console.error("Submission Error:", error);
      setStatus("error");

    } finally {
      setLoading(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      project_description: "",
      budget: "",
      timeline: "",
      attachment_url: ""
    });
    setAttachmentFile(null);
    setImagePreview(null);
    setStatus(null);
  };

  return (
    <section className="py-16 px-6 bg-[#0a0d37] text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Hire Me</h2>

      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-6">
        I’m available for freelance projects. If you want a high-quality website,
        mobile app, or frontend work, feel free to send me your project details.
      </p>

      {!showForm && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-[#16f2b3] text-black font-bold rounded-lg shadow hover:opacity-80 transition"
          >
            Request for Freelance Work
          </button>
        </div>
      )}

      {showForm && (
        <div className="mt-10 max-w-lg mx-auto bg-[#11163a] p-6 rounded-xl shadow-lg relative">

          {/* Close Button */}
          <button
            onClick={closeForm}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <span className="text-xl">×</span>
          </button>

          <h3 className="text-xl font-semibold mb-4">Send Your Project Details</h3>

          {/* Status Messages */}
          {status === "success" && (
            <div className="p-4 mb-4 bg-green-900 text-green-300 rounded-lg">
              Thank you for your request! I'll review it and get back to you soon.
            </div>
          )}

          {status === "error" && (
            <div className="p-4 mb-4 bg-red-900 text-red-300 rounded-lg">
              Submission failed. Please try again later.
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading || status === "success"}
              className="w-full p-3 rounded bg-[#0d1224] border border-gray-600"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading || status === "success"}
              className="w-full p-3 rounded bg-[#0d1224] border border-gray-600"
            />

            <textarea
              name="project_description"
              placeholder="Explain your project..."
              rows="4"
              value={formData.project_description}
              onChange={handleInputChange}
              required
              disabled={loading || status === "success"}
              className="w-full p-3 rounded bg-[#0d1224] border border-gray-600"
            ></textarea>

            <input
              type="text"
              name="budget"
              placeholder="Budget (optional)"
              value={formData.budget}
              onChange={handleInputChange}
              disabled={loading || status === "success"}
              className="w-full p-3 rounded bg-[#0d1224] border border-gray-600"
            />

            <input
              type="text"
              name="timeline"
              placeholder="Timeline (optional)"
              value={formData.timeline}
              onChange={handleInputChange}
              disabled={loading || status === "success"}
              className="w-full p-3 rounded bg-[#0d1224] border border-gray-600"
            />

            {/* File Upload */}
            <div className="flex items-center space-x-3">
              <input
                type="file"
                id="attachment_file"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading || status === "success"}
              />

              <button
                type="button"
                onClick={() => document.getElementById("attachment_file").click()}
                className="flex-1 p-3 rounded bg-[#0d1224] border border-gray-600 text-left text-gray-300"
                disabled={loading || status === "success"}
              >
                {attachmentFile ? attachmentFile.name : "Choose file (optional)"}
              </button>

              {attachmentFile && (
                <button
                  type="button"
                  onClick={() => {
                    setAttachmentFile(null);
                    setImagePreview(null);
                    setFormData({ ...formData, attachment_url: "" });
                  }}
                  className="px-3 py-3 bg-red-600 text-white rounded"
                  disabled={loading || status === "success"}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6"
                    disabled={loading || status === "success"}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

<div className="flex justify-between gap-4">
  
  {/* Submit Button */}
  <button
    type="submit"
    disabled={loading || status === "success"}
    className={`w-full text-black font-bold py-3 rounded-lg transition ${
      loading || status === "success"
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-[#16f2b3] hover:opacity-80"
    }`}
  >
    {loading ? "Sending..." : "Send Request"}
  </button>

  {/* Cancel Button */}
  <button
    type="button"   // IMPORTANT: Not submit
    onClick={closeForm}
    disabled={loading}
    className={`w-full text-black font-bold py-3 rounded-lg transition ${
      loading
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-red-400 hover:opacity-80"
    }`}
  >
    Cancel
  </button>

</div>

          </form>
        </div>
      )}
    </section>
  );
}
