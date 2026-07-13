"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  Check,
  Layers,
  Layout,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import dashboardStyles from "../../../dashboard.module.css";
import localStyles from "./services-manager.module.css";
import Modal from "../../../_components/Modal/Modal";
import ImageUpload from "../../../_components/ImageUpload/ImageUpload";
import { toast } from "react-toastify";
import {
  createSectionAPI,
  updateSectionAPI,
  deleteSectionAPI,
  deleteImageAPI,
  BASE_URL,
} from "@/lib/api";
import useCMSStore from "@/store/useCMSStore";
import { confirmDelete } from "@/lib/sweetalert";

export default function ServicesManager() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  // Banner state (for /services page)
  const [banner, setBanner] = useState({
    id: null,
    title_en: "",
    title_ar: "",
    subtitle_en: "",
    subtitle_ar: "",
    image: null,
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Section Header state (for home page services section)
  const [sectionHeader, setSectionHeader] = useState({
    id: null,
    title_en: "",
    title_ar: "",
    subtitle_en: "",
    subtitle_ar: "",
  });

  // For new service
  const [newService, setNewService] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    imageFile: null,
    imagePreview: null,
  });

  // For editing existing service image
  const [editorFile, setEditorFile] = useState(null);
  const [editorPreview, setEditorPreview] = useState(null);

  // Reset editor file when active item changes
  useEffect(() => {
    setEditorFile(null);
    setEditorPreview(null);
  }, [activeItem]);

  // Fetch all services data on mount
  useEffect(() => {
    const fetchAllData = () => {
      setLoading(true);
      try {
        if (sections && sections.length > 0) {
          // Fetch service items
          const servicesSections = sections.filter(
            (s) => s.section_key === "home" && s.type === "service",
          );
          if (servicesSections.length > 0) {
            const mappedServices = servicesSections.map((s) => ({
              id: s.id,
              title_en: s.title_en,
              title_ar: s.title_ar,
              description_en: s.description_en,
              description_ar: s.description_ar,
              image:
                s.images && s.images.length > 0
                  ? `${BASE_URL}${s.images[s.images.length - 1]}`
                  : null,
            }));
            setServices(mappedServices);
          }

          // Fetch banner
          const bannerSection = sections.find(
            (s) => s.section_key === "home" && s.type === "service_banner",
          );
          if (bannerSection) {
            setBanner({
              id: bannerSection.id,
              title_en: bannerSection.title_en || "",
              title_ar: bannerSection.title_ar || "",
              subtitle_en: bannerSection.description_en || "",
              subtitle_ar: bannerSection.description_ar || "",
              image:
                bannerSection.images && bannerSection.images.length > 0
                  ? `${BASE_URL}${bannerSection.images[bannerSection.images.length - 1]}`
                  : null,
              rawImage:
                bannerSection.images && bannerSection.images.length > 0
                  ? bannerSection.images[bannerSection.images.length - 1]
                  : null,
            });
          }

          // Fetch section header
          const headerSection = sections.find(
            (s) => s.section_key === "home" && s.type === "service_header",
          );
          if (headerSection) {
            setSectionHeader({
              id: headerSection.id,
              title_en: headerSection.title_en || "",
              title_ar: headerSection.title_ar || "",
              subtitle_en: headerSection.description_en || "",
              subtitle_ar: headerSection.description_ar || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [sections]);

  const handleAddService = async () => {
    const errors = {};
    if (!newService.title_en) errors.new_title_en = true;
    if (!newService.title_ar) errors.new_title_ar = true;
    if (!newService.description_en) errors.new_description_en = true;
    if (!newService.description_ar) errors.new_description_ar = true;
    if (!newService.imageFile) errors.new_image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields and upload an image");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title_en", newService.title_en);
      formData.append("title_ar", newService.title_ar);
      formData.append("description_en", newService.description_en);
      formData.append("description_ar", newService.description_ar);
      formData.append("section_key", "home");
      formData.append("type", "service");
      formData.append("is_active", "true");

      if (newService.imageFile) {
        formData.append("images", newService.imageFile);
      }

      await createSectionAPI(formData);
      await refreshSections();

      toast.success("Service added successfully");
      setIsModalOpen(false);

      setNewService({
        title_en: "",
        title_ar: "",
        description_en: "",
        description_ar: "",
        imageFile: null,
        imagePreview: null,
      });
      // Optionally update activeItem if you want to focus on the new one, but fetching fresh data handles the list.
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error occurred while adding the service",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveChanges = async () => {
    const currentService = services[activeItem];
    const errors = {};
    if (!currentService.title_en) errors.edit_title_en = true;
    if (!currentService.title_ar) errors.edit_title_ar = true;
    if (!currentService.description_en) errors.edit_description_en = true;
    if (!currentService.description_ar) errors.edit_description_ar = true;
    if (!currentService.image && !editorFile) errors.edit_image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields and upload an image");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title_en", currentService.title_en);
      formData.append("title_ar", currentService.title_ar);
      formData.append("description_en", currentService.description_en);
      formData.append("description_ar", currentService.description_ar);
      formData.append("section_key", "home");
      formData.append("type", "service");
      formData.append("is_active", "true");

      if (editorFile) {
        formData.append("images", editorFile);
      }

      await updateSectionAPI(currentService.id, formData);
      await refreshSections();
      toast.success("Service updated successfully");

      setEditorFile(null);
      setEditorPreview(null);
    } catch (error) {
      console.error("Update Error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "An error occurred while updating",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeService = async (id) => {
    if (!id) return;

    const result = await confirmDelete(
      "Delete Service",
      "Are you sure you want to delete this service?",
    );
    if (result.isConfirmed) {
      try {
        await deleteSectionAPI(id);
        await refreshSections();
        setActiveItem(0);
        toast.success("Service deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting");
      }
    }
  };

  const updateActiveService = (field, value) => {
    const updatedServices = [...services];
    updatedServices[activeItem][field] = value;
    setServices(updatedServices);
    const errorKey = `edit_${field}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const updateBanner = (field, value) => {
    setBanner((prev) => ({ ...prev, [field]: value }));
    const errorKey = `banner_${field}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const updateSectionHeader = (field, value) => {
    setSectionHeader((prev) => ({ ...prev, [field]: value }));
    const errorKey = `header_${field}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const removeImage = async (type, id = null) => {
    if (type === "service") {
      const currentService = services[activeItem];
      // Local preview only
      if (
        editorFile ||
        (currentService?.image && currentService.image.startsWith("blob:"))
      ) {
        setEditorFile(null);
        setEditorPreview(null);

        // Remove the blob from the service state to show empty state
        const updatedServices = [...services];
        updatedServices[activeItem].image = null;
        setServices(updatedServices);
        return;
      }

      // Server image
      if (currentService && currentService.image && currentService.id) {
        const result = await confirmDelete(
          "Delete Image",
          "Are you sure you want to delete this service image permanently?",
        );
        if (result.isConfirmed) {
          try {
            const rawPath = currentService.image.replace(BASE_URL, "");
            await deleteImageAPI(currentService.id, rawPath);
            await refreshSections();

            const updatedServices = [...services];
            updatedServices[activeItem].image = null;
            setServices(updatedServices);
            toast.success("Image deleted successfully");
          } catch (e) {
            console.error(e);
            toast.error("Failed to delete image");
          }
        }
      }
    } else if (type === "banner") {
      // Local preview
      if (bannerFile || (banner.image && banner.image.startsWith("blob:"))) {
        setBannerFile(null);
        setBannerPreview(null);

        // Remove blob from banner state
        setBanner((prev) => ({ ...prev, image: null }));
        return;
      }

      // Server image
      if (banner.id && banner.image) {
        const result = await confirmDelete(
          "Delete Banner Image",
          "Are you sure you want to delete the banner image permanently?",
        );
        if (result.isConfirmed) {
          try {
            await deleteImageAPI(
              banner.id,
              banner.rawImage || banner.image.replace(BASE_URL, ""),
            );
            await refreshSections();
            setBanner((prev) => ({ ...prev, image: null, rawImage: null }));
            toast.success("Banner image deleted successfully");
          } catch (e) {
            console.error(e);
            toast.error("Failed to delete banner image");
          }
        }
      }
    }
  };

  const handleSaveBanner = async () => {
    const errors = {};
    if (!banner.title_en) errors.banner_title_en = true;
    if (!banner.title_ar) errors.banner_title_ar = true;
    if (!banner.subtitle_en) errors.banner_subtitle_en = true;
    if (!banner.subtitle_ar) errors.banner_subtitle_ar = true;
    if (!banner.image && !bannerFile) errors.banner_image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all banner fields and upload an image");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title_en", banner.title_en);
      formData.append("title_ar", banner.title_ar);
      formData.append("description_en", banner.subtitle_en);
      formData.append("description_ar", banner.subtitle_ar);
      formData.append("section_key", "home");
      formData.append("type", "service_banner");
      formData.append("is_active", "true");

      if (bannerFile) {
        formData.append("images", bannerFile);
      }

      let response;
      if (banner.id) {
        response = await updateSectionAPI(banner.id, formData);
      } else {
        response = await createSectionAPI(formData);
      }

      await refreshSections();
      toast.success(response.message || "Banner saved successfully");

      setBannerFile(null);
      setBannerPreview(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while saving the banner",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSectionHeader = async () => {
    const errors = {};
    if (!sectionHeader.title_en) errors.header_title_en = true;
    if (!sectionHeader.title_ar) errors.header_title_ar = true;
    if (!sectionHeader.subtitle_en) errors.header_subtitle_en = true;
    if (!sectionHeader.subtitle_ar) errors.header_subtitle_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all section header fields");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title_en", sectionHeader.title_en);
      formData.append("title_ar", sectionHeader.title_ar);
      formData.append("description_en", sectionHeader.subtitle_en);
      formData.append("description_ar", sectionHeader.subtitle_ar);
      formData.append("section_key", "home");
      formData.append("type", "service_header");
      formData.append("is_active", "true");

      if (sectionHeader.id) {
        await updateSectionAPI(sectionHeader.id, formData);
      } else {
        await createSectionAPI(formData);
      }

      await refreshSections();
      toast.success("Section header saved successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while saving section header",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!banner.id) {
      toast.error("No banner to delete");
      return;
    }

    const result = await confirmDelete(
      "Delete Banner",
      "Are you sure you want to delete the banner?",
    );
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await deleteSectionAPI(banner.id);
        await refreshSections();
        toast.success("Banner deleted successfully");
        setBanner({
          id: null,
          title_en: "",
          title_ar: "",
          subtitle_en: "",
          subtitle_ar: "",
          image: null,
        });
        setBannerFile(null);
        setBannerPreview(null);
      } catch (error) {
        toast.error("An error occurred while deleting the banner");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSectionHeader = async () => {
    if (!sectionHeader.id) {
      toast.error("No section header to delete");
      return;
    }

    const result = await confirmDelete(
      "Delete Header",
      "Are you sure you want to delete the section header?",
    );
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await deleteSectionAPI(sectionHeader.id);
        await refreshSections();
        toast.success("Section header deleted successfully");
        setSectionHeader({
          id: null,
          title_en: "",
          title_ar: "",
          subtitle_en: "",
          subtitle_ar: "",
        });
      } catch (error) {
        toast.error("An error occurred while deleting section header");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p>Loading services...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>
            Home Services Section
          </h2>
          <p className={dashboardStyles.sectionSubtitle}>
            Manage all premier services displayed on your homepage.
          </p>
        </div>
        <div className={localStyles.headerActions}>
          <button
            className={localStyles.saveButton}
            onClick={handleSaveChanges}
            disabled={isSubmitting}
          >
            <Save size={20} /> {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left: Services Sidebar */}
        <div className={localStyles.sidebar}>
          <div
            className={`${dashboardStyles.contentCard} ${localStyles.listCard}`}
          >
            <div className={localStyles.sidebarHeader}>
              <div
                className={localStyles.sectionHeader}
                style={{ marginBottom: 0 }}
              >
                <Layers size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>
                  Services List ({services.length})
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className={localStyles.addBtn}
                title="Add New Service"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className={localStyles.itemsList}>
              {services.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    padding: "2rem",
                  }}
                >
                  No services found. Add one to get started.
                </p>
              ) : (
                services.map((service, index) => (
                  <div
                    key={service.id}
                    onClick={() => setActiveItem(index)}
                    className={`${localStyles.itemCard} ${activeItem === index ? localStyles.itemCardActive : ""}`}
                  >
                    <div className={localStyles.itemThumb}>
                      {service.image ? (
                        <img src={service.image} alt="" />
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            background: "#f1f5f9",
                          }}
                        >
                          <ImageIcon size={24} color="#94a3b8" />
                        </div>
                      )}
                    </div>
                    <div className={localStyles.itemInfo}>
                      <div className={localStyles.itemTitle}>
                        {service.title_en}
                      </div>
                      <div className={localStyles.itemMeta}>
                        Service {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>
                    {activeItem === index && (
                      <Check size={16} color="#DC143C" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Active Service Editor */}
        <div className={localStyles.editorContainer}>
          {services.length > 0 && services[activeItem] ? (
            <div className={dashboardStyles.contentCard}>
              <div className={localStyles.editorHeader}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "800" }}>
                  Editing: {services[activeItem]?.title_en}
                </h3>
                <button
                  onClick={() => removeService(services[activeItem].id)}
                  className={localStyles.deleteBtn}
                  title="Remove this service"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>

              {/* Title Fields */}
              <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>
                    Service Title (EN)
                  </label>
                  <input
                    type="text"
                    value={services[activeItem].title_en}
                    onChange={(e) =>
                      updateActiveService("title_en", e.target.value)
                    }
                    className={`${localStyles.inputField} ${formErrors.edit_title_en ? dashboardStyles.invalidInput : ""}`}
                    style={{ fontWeight: "700" }}
                  />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>
                    Service Title (AR)
                  </label>
                  <input
                    type="text"
                    value={services[activeItem].title_ar}
                    onChange={(e) =>
                      updateActiveService("title_ar", e.target.value)
                    }
                    className={`${localStyles.inputField} ${formErrors.edit_title_ar ? dashboardStyles.invalidInput : ""}`}
                    style={{ fontWeight: "700" }}
                  />
                </div>
              </div>

              {/* Description Fields */}
              <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>
                    Description (EN)
                  </label>
                  <textarea
                    rows="4"
                    value={services[activeItem].description_en}
                    onChange={(e) =>
                      updateActiveService("description_en", e.target.value)
                    }
                    className={`${localStyles.textareaField} ${formErrors.edit_description_en ? dashboardStyles.invalidInput : ""}`}
                  />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>
                    Service Description (AR)
                  </label>
                  <textarea
                    rows="4"
                    value={services[activeItem].description_ar}
                    onChange={(e) =>
                      updateActiveService("description_ar", e.target.value)
                    }
                    className={`${localStyles.textareaField} ${formErrors.edit_description_ar ? dashboardStyles.invalidInput : ""}`}
                  />
                </div>
              </div>

              {/* Image Preview */}
              <div className={localStyles.mediaSection}>
                <label className={localStyles.fieldLabel}>Featured Image</label>
                <ImageUpload
                  value={services[activeItem].image}
                  mode="standard"
                  height="220px"
                  onChange={(file) => {
                    setEditorFile(file);
                    setEditorPreview(URL.createObjectURL(file));

                    const updatedServices = [...services];
                    updatedServices[activeItem].image =
                      URL.createObjectURL(file);
                    setServices(updatedServices);
                    if (formErrors.edit_image) {
                      const newErrors = { ...formErrors };
                      delete newErrors.edit_image;
                      setFormErrors(newErrors);
                    }
                  }}
                  onDelete={() => removeImage("service")}
                />
                {formErrors.edit_image && (
                  <div
                    style={{
                      border: "2px solid #DC143C",
                      borderRadius: "12px",
                      marginTop: "-220px",
                      height: "220px",
                      pointerEvents: "none",
                    }}
                  ></div>
                )}
              </div>
            </div>
          ) : (
            <div className={dashboardStyles.contentCard}>
              <p
                style={{
                  textAlign: "center",
                  color: "#64748b",
                  padding: "3rem",
                }}
              >
                No services available. Click "Add New Service" to create one.
              </p>
            </div>
          )}

          {/* Services Page Banner - Always visible */}
          <div
            className={dashboardStyles.contentCard}
            style={{ marginTop: "1.5rem" }}
          >
            <div className={localStyles.sectionHeader}>
              <ImageIcon size={20} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>
                Services Page Hero Banner
              </h3>
            </div>

            <div
              className={localStyles.mediaSection}
              style={{ marginBottom: "1.5rem" }}
            >
              <label className={localStyles.fieldLabel}>Banner Image</label>
              <ImageUpload
                value={banner.image}
                mode="hero"
                height="200px"
                onChange={(file) => {
                  setBannerFile(file);
                  setBannerPreview(URL.createObjectURL(file));
                  setBanner((prev) => ({
                    ...prev,
                    image: URL.createObjectURL(file),
                  }));
                  if (formErrors.banner_image) {
                    const newErrors = { ...formErrors };
                    delete newErrors.banner_image;
                    setFormErrors(newErrors);
                  }
                }}
                onDelete={() => removeImage("banner")}
              />
              {formErrors.banner_image && (
                <div
                  style={{
                    border: "2px solid #DC143C",
                    borderRadius: "12px",
                    marginTop: "-200px",
                    height: "200px",
                    pointerEvents: "none",
                  }}
                ></div>
              )}
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  marginTop: "0.5rem",
                }}
              >
                This banner appears only on the <strong>/services</strong> page.
              </p>
            </div>

            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>
                  Banner Title (EN)
                </label>
                <input
                  type="text"
                  value={banner.title_en}
                  onChange={(e) => updateBanner("title_en", e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.banner_title_en ? dashboardStyles.invalidInput : ""}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>
                  Banner Title (AR)
                </label>
                <input
                  type="text"
                  value={banner.title_ar}
                  onChange={(e) => updateBanner("title_ar", e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.banner_title_ar ? dashboardStyles.invalidInput : ""}`}
                />
              </div>
            </div>
            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>
                  Banner Subtitle (EN)
                </label>
                <input
                  type="text"
                  value={banner.subtitle_en}
                  onChange={(e) => updateBanner("subtitle_en", e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.banner_subtitle_en ? dashboardStyles.invalidInput : ""}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>
                  Banner Subtitle (AR)
                </label>
                <input
                  type="text"
                  value={banner.subtitle_ar}
                  onChange={(e) => updateBanner("subtitle_ar", e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.banner_subtitle_ar ? dashboardStyles.invalidInput : ""}`}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              {banner.id && (
                <button
                  onClick={handleDeleteBanner}
                  style={{
                    backgroundColor: "white",
                    color: "#DC143C",
                    border: "1px solid #DC143C",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "12px",
                    fontWeight: "800",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Trash2 size={18} /> Delete Banner
                </button>
              )}
              <button
                onClick={handleSaveBanner}
                className={localStyles.saveButton}
                disabled={isSubmitting}
                style={{ marginLeft: "auto" }}
              >
                <Save size={18} /> {isSubmitting ? "Saving..." : "Save Banner"}
              </button>
            </div>
          </div>

          {/* Section Header Editor */}
          <div
            className={dashboardStyles.contentCard}
            style={{ marginTop: "1.5rem" }}
          >
            <div className={localStyles.sectionHeader}>
              <Layout size={20} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>
                Section Titles Control (Home Page)
              </h3>
            </div>
            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>
                  Section Title (EN)
                </label>
                <input
                  type="text"
                  value={sectionHeader.title_en}
                  onChange={(e) =>
                    updateSectionHeader("title_en", e.target.value)
                  }
                  className={`${localStyles.inputField} ${formErrors.header_title_en ? dashboardStyles.invalidInput : ""}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>
                  Section Title (AR)
                </label>
                <input
                  type="text"
                  value={sectionHeader.title_ar}
                  onChange={(e) =>
                    updateSectionHeader("title_ar", e.target.value)
                  }
                  className={`${localStyles.inputField} ${formErrors.header_title_ar ? dashboardStyles.invalidInput : ""}`}
                />
              </div>
            </div>
            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>
                  Section Subtitle (EN)
                </label>
                <textarea
                  rows="2"
                  value={sectionHeader.subtitle_en}
                  onChange={(e) =>
                    updateSectionHeader("subtitle_en", e.target.value)
                  }
                  className={`${localStyles.textareaField} ${formErrors.header_subtitle_en ? dashboardStyles.invalidInput : ""}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>
                  Section Subtitle (AR)
                </label>
                <textarea
                  rows="2"
                  value={sectionHeader.subtitle_ar}
                  onChange={(e) =>
                    updateSectionHeader("subtitle_ar", e.target.value)
                  }
                  className={`${localStyles.textareaField} ${formErrors.header_subtitle_ar ? dashboardStyles.invalidInput : ""}`}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              {sectionHeader.id && (
                <button
                  onClick={handleDeleteSectionHeader}
                  style={{
                    backgroundColor: "white",
                    color: "#DC143C",
                    border: "1px solid #DC143C",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "12px",
                    fontWeight: "800",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Trash2 size={18} /> Delete Section Header
                </button>
              )}
              <button
                onClick={handleSaveSectionHeader}
                className={localStyles.saveButton}
                disabled={isSubmitting}
                style={{ marginLeft: "auto" }}
              >
                <Save size={18} />{" "}
                {isSubmitting ? "Saving..." : "Save Section Header"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Service"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className={localStyles.cancelBtn}
            >
              Cancel
            </button>
            <button
              onClick={handleAddService}
              className={localStyles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Service"}
            </button>
          </>
        }
      >
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Service Title (EN)</label>
            <input
              type="text"
              placeholder="Enter title in English"
              value={newService.title_en}
              onChange={(e) => {
                setNewService({ ...newService, title_en: e.target.value });
                if (formErrors.new_title_en) {
                  const newErrors = { ...formErrors };
                  delete newErrors.new_title_en;
                  setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_title_en ? dashboardStyles.invalidInput : ""}`}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Service Title (AR)</label>
            <input
              type="text"
              placeholder="e.g. Earthmoving & Excavation"
              value={newService.title_ar}
              onChange={(e) => {
                setNewService({ ...newService, title_ar: e.target.value });
                if (formErrors.new_title_ar) {
                  const newErrors = { ...formErrors };
                  delete newErrors.new_title_ar;
                  setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_title_ar ? dashboardStyles.invalidInput : ""}`}
            />
          </div>
        </div>
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Description (EN)</label>
            <textarea
              rows="3"
              placeholder="Enter description in English"
              value={newService.description_en}
              onChange={(e) => {
                setNewService({
                  ...newService,
                  description_en: e.target.value,
                });
                if (formErrors.new_description_en) {
                  const newErrors = { ...formErrors };
                  delete newErrors.new_description_en;
                  setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.textareaField} ${formErrors.new_description_en ? dashboardStyles.invalidInput : ""}`}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>
              Service Description (AR)
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Detailed description of the service..."
              value={newService.description_ar}
              onChange={(e) => {
                setNewService({
                  ...newService,
                  description_ar: e.target.value,
                });
                if (formErrors.new_description_ar) {
                  const newErrors = { ...formErrors };
                  delete newErrors.new_description_ar;
                  setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.textareaField} ${formErrors.new_description_ar ? dashboardStyles.invalidInput : ""}`}
            />
          </div>
        </div>
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Service Image</label>
          <ImageUpload
            value={newService.imagePreview}
            mode="standard"
            height="200px"
            onChange={(file) => {
              setNewService({
                ...newService,
                imageFile: file,
                imagePreview: URL.createObjectURL(file),
              });
              if (formErrors.new_image) {
                const newErrors = { ...formErrors };
                delete newErrors.new_image;
                setFormErrors(newErrors);
              }
            }}
            onDelete={() => {
              setNewService({
                ...newService,
                imageFile: null,
                imagePreview: null,
              });
            }}
          />
          {formErrors.new_image && (
            <div
              style={{
                border: "2px solid #DC143C",
                borderRadius: "12px",
                marginTop: "-200px",
                height: "200px",
                pointerEvents: "none",
              }}
            ></div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}
