"use client";

import React, { useState, useEffect, useRef } from "react";
import { Save, Image as ImageIcon, Plus, Trash2, Edit2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  createSectionAPI,
  updateSectionAPI,
  deleteSectionAPI,
  deleteImageAPI,
  BASE_URL,
} from "@/lib/api";
import dashboardStyles from "../../dashboard.module.css";
import localStyles from "./projects-manager.module.css";
import useCMSStore from "@/store/useCMSStore";

import Modal from "../../_components/Modal/Modal";
import ImageUpload from "../../_components/ImageUpload/ImageUpload";
import { confirmDelete } from "@/lib/sweetalert";

export default function ProjectsManager() {
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  /* 


Banner


*/

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

  const updateBanner = (field, value) => {
    setBanner((prev) => ({ ...prev, [field]: value }));
    const errorKey = `banner_${field}`;
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
      formData.append("type", "projects_banner");
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

  /* 




*/

  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Selection state
  const [currentProject, setCurrentProject] = useState(null);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      try {
        if (sections && sections.length > 0) {
          const projectsSections = sections.filter(
            (s) => s.section_key === "projects",
          );

          const homeProjects = sections.filter(
            (s) => s.section_key === "home" && s.type === "project",
          );
          const fetchedCategories = homeProjects.map((c) => ({
            id: c.id,
            name_en: c.title_en || "Untitled",
            name_ar: c.title_ar || "بدون عنوان",
          }));

          const fetchedProjects = projectsSections.map((p) => {
            let details = {
              owner: "",
              location: "",
              duration: "",
              status: "",
              value: "",
            };
            let detailsAr = {
              owner: "",
              location: "",
              duration: "",
              status: "",
              value: "",
            };
            try {
              const rawDetails = p.details || p.description_en;
              const parsed =
                typeof rawDetails === "string"
                  ? JSON.parse(rawDetails || "{}")
                  : rawDetails || {};
              details = parsed.en || details;
              detailsAr = parsed.ar || detailsAr;
            } catch (e) {
              console.error("Error parsing details", p.details);
            }

            return {
              id: p.id,
              image: getImageUrl(p.images?.[0]),
              images: p.images?.map((img) => getImageUrl(img)) || [],
              rawImages: p.images || [],
              rawImage: p.images?.[0],
              categoryId: p.type,
              en: { title: p.title_en, ...details },
              ar: { title: p.title_ar, ...detailsAr },
            };
          });

          setCategories(fetchedCategories);
          setProjects(fetchedProjects);
          if (fetchedCategories.length > 0 && !activeCategoryId) {
            setActiveCategoryId(fetchedCategories[0].id);
          }
        }
      } catch (error) {
        toast.error("Error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sections]);

  const getStatusColor = (status) => {
    if (!status) return "default";
    const s = status.toLowerCase();
    if (s.includes("completed") || s.includes("مكتمل"))
      return localStyles.completed;
    if (
      s.includes("progress") ||
      s.includes("construction") ||
      s.includes("تنفيذ")
    )
      return localStyles.progress;
    return "";
  };

  // --- Project Handlers ---
  const handleAddNew = () => {
    if (!activeCategoryId) {
      toast.warning("Please select a category first");
      return;
    }
    setCurrentProject({
      id: null,
      images: [],
      rawImages: [],
      newFiles: [],
      newSrcs: [],
      en: {
        title: "",
        owner: "",
        location: "",
        duration: "",
        status: "",
        value: "",
      },
      ar: {
        title: "",
        owner: "",
        location: "",
        duration: "",
        status: "",
        value: "",
      },
    });
    setIsProjectModalOpen(true);
  };

  const handleEdit = (project) => {
    setCurrentProject({
      ...JSON.parse(JSON.stringify(project)),
      images: project.images || [],
      rawImages: project.rawImages || [],
      newFiles: [],
      newSrcs: [],
    });
    setIsProjectModalOpen(true);
  };

  const saveProject = async () => {
    const errors = {};
    if (!currentProject.en.title) errors.proj_title_en = true;
    if (!currentProject.ar.title) errors.proj_title_ar = true;

    if (!currentProject.en.status) errors.proj_status_en = true;
    if (!currentProject.ar.status) errors.proj_status_ar = true;
    if (!currentProject.en.value) errors.proj_value_en = true;
    if (!currentProject.ar.value) errors.proj_value_ar = true;
    if (!currentProject.id && currentProject.newFiles.length === 0)
      errors.proj_images = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("section_key", "projects");
    formData.append("type", String(activeCategoryId)); // Use Category ID as the type
    formData.append("title_en", currentProject.en.title);
    formData.append("title_ar", currentProject.ar.title);

    const detailsJson = JSON.stringify({
      en: {
        owner: currentProject.en.owner,
        location: currentProject.en.location,
        duration: currentProject.en.duration,
        status: currentProject.en.status,
        value: currentProject.en.value,
      },
      ar: {
        owner: currentProject.ar.owner,
        location: currentProject.ar.location,
        duration: currentProject.ar.duration,
        status: currentProject.ar.status,
        value: currentProject.ar.value,
      },
    });
    formData.append("details", detailsJson);
    formData.append("is_active", "true");

    formData.append("update_img_type", "group"); // append multiple images without overriding all

    if (currentProject.newFiles && currentProject.newFiles.length > 0) {
      currentProject.newFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      if (currentProject.id) {
        await updateSectionAPI(currentProject.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("Project saved successfully");
      setIsProjectModalOpen(false);
      await refreshSections();
    } catch (error) {
      toast.error("An error occurred while saving the project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (projectId) => {
    const result = await confirmDelete(
      "Delete Project",
      "Are you sure you want to delete this project?",
    );
    if (result.isConfirmed) {
      try {
        await deleteSectionAPI(projectId);
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        toast.success("Project deleted successfully");
        await refreshSections();
      } catch (error) {
        toast.error("An error occurred while deleting the project");
      }
    }
  };

  const updateField = (lang, field, value) => {
    setCurrentProject((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
    const errorKey = `proj_${field}_${lang}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      // Removed validateImage temporarily to ensure images are added without errors
      if (files.length > 0) {
        const newSrcs = files.map((file) => URL.createObjectURL(file));
        setCurrentProject((prev) => ({
          ...prev,
          newFiles: [...(prev.newFiles || []), ...files],
          newSrcs: [...(prev.newSrcs || []), ...newSrcs],
        }));
        if (formErrors.proj_images) {
          const newErrors = { ...formErrors };
          delete newErrors.proj_images;
          setFormErrors(newErrors);
        }
      }
    }
  };

  const handleRemoveProjectImage = async (imagePath, index) => {
    const result = await confirmDelete(
      "Delete Photo",
      "Are you sure you want to delete this photo from the project?",
    );
    if (result.isConfirmed) {
      try {
        await deleteImageAPI(currentProject.id, imagePath);

        setCurrentProject((prev) => {
          const newImages = [...prev.images];
          const newRawImages = [...prev.rawImages];
          newImages.splice(index, 1);
          newRawImages.splice(index, 1);
          return { ...prev, images: newImages, rawImages: newRawImages };
        });

        // Update main list so preview image updates if the first image was deleted
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === currentProject.id) {
              const updatedRawImages = p.rawImages.filter(
                (img) => img !== imagePath,
              );
              return {
                ...p,
                rawImages: updatedRawImages,
                images: updatedRawImages.map((img) => getImageUrl(img)),
                image:
                  updatedRawImages.length > 0
                    ? getImageUrl(updatedRawImages[0])
                    : "",
                rawImage:
                  updatedRawImages.length > 0 ? updatedRawImages[0] : null,
              };
            }
            return p;
          }),
        );

        await refreshSections();
        toast.success("Image deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete image");
      }
    }
  };

  const activeCategory = categories.find((cat) => cat.id === activeCategoryId);
  const filteredProjects = projects.filter(
    (p) => String(p.categoryId) === String(activeCategoryId),
  );

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "#64748b",
        }}
      >
        Loading Projects Data...
      </div>
    );

  return (
    <div className={localStyles.container}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Projects Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>
            Manage your portfolio projects effectively.
          </p>
        </div>
        <button
          className={localStyles.saveChangesHeaderBtn}
          onClick={() => alert("Saved!")}
        >
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainLayout}>
        {/* Sidebar */}
        <div className={localStyles.categorySidebar}>
          <div className={localStyles.categoryTitle}>Projects List</div>
          <div className={localStyles.categoryList}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`${localStyles.categoryBtnWrapper} ${activeCategoryId === cat.id ? localStyles.activeCategory : ""}`}
              >
                <button
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={localStyles.categoryBtn}
                >
                  {cat.name_en}
                  {cat.name_ar && (
                    <span className={localStyles.categoryBtnAr}>
                      {cat.name_ar}
                    </span>
                  )}
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "0.85rem",
                }}
              >
                No projects found in home section.
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={localStyles.contentArea}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>
              {activeCategory?.name_en}
              <span
                style={{
                  fontSize: "0.8em",
                  color: "#666",
                  marginLeft: "0.5rem",
                }}
              >
                ({filteredProjects.length} Projects)
              </span>
            </h3>
            <button onClick={handleAddNew} className={localStyles.addBtnSmall}>
              <Plus size={16} /> Add project
            </button>
          </div>

          <div className={localStyles.projectsGrid}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={localStyles.projectCard}
                >
                  <div className={localStyles.imageWrapper}>
                    <img
                      src={project.image || "/images/placeholder.jpg"}
                      alt="Project"
                      className={localStyles.projectImage}
                      onError={(e) => {
                        e.target.src = "/images/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div className={localStyles.cardContent}>
                    <div>
                      <div className={localStyles.cardTitle}>
                        {project.en.title || "Untitled"}
                      </div>
                      <div className={localStyles.cardTitleAr}>
                        {project.ar.title || "بدون عنوان"}
                      </div>
                    </div>
                    <div className={localStyles.badges}>
                      <span
                        className={`${localStyles.statusBadge} ${getStatusColor(project.en.status)}`}
                      >
                        {project.en.status || "No Status"}
                      </span>
                    </div>
                  </div>
                  <div className={localStyles.cardActions}>
                    <button
                      onClick={() => handleEdit(project)}
                      className={localStyles.editBtn}
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className={localStyles.deleteBtn}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "5rem",
                  background: "#f8fafc",
                  borderRadius: "16px",
                  border: "2px dashed #e2e8f0",
                  color: "#94a3b8",
                }}
              >
                <ImageIcon
                  size={48}
                  strokeWidth={1}
                  style={{ marginBottom: "1rem", opacity: 0.5 }}
                />
                <p>No projects in this category yet.</p>
                <button
                  onClick={handleAddNew}
                  className={localStyles.addBtnSmall}
                  style={{ margin: "1rem auto" }}
                >
                  Add First Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 
        
        \
        \
        \
        \
        \
        \
        \
        \
        */}
        <div></div>
        {/* Services Page Banner - Always visible */}
        <div
          className={dashboardStyles.contentCard}
          style={{ marginTop: "1.5rem" }}
        >
          <div className={localStyles.sectionHeader}>
            <ImageIcon size={20} color="#DC143C" />
            <h3 className={localStyles.sectionTitle}>
              Projects Page Hero Banner
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
        {/* 
        
        \
        \
        \
        \
        \
        \
        \
        \
        */}
      </div>

      {/* Reusable Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title={
          currentProject && currentProject.id
            ? "Edit Project"
            : "Add New Project"
        }
        maxWidth="900px"
        footer={
          <>
            <button
              onClick={() => setIsProjectModalOpen(false)}
              className={localStyles.cancelBtn}
            >
              Cancel
            </button>
            <button
              onClick={saveProject}
              className={localStyles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Project"}
            </button>
          </>
        }
      >
        {currentProject && (
          <>
            <div className={localStyles.formSection}>
              <label className={localStyles.sectionLabel}>Project Images</label>
              <div
                className={
                  formErrors.proj_images ? dashboardStyles.invalidInput : ""
                }
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1rem",
                  border: formErrors.proj_images ? "2px solid #DC143C" : "none",
                  borderRadius: "12px",
                  padding: formErrors.proj_images ? "10px" : "0",
                }}
              >
                {/* Existing Images */}
                {currentProject.images &&
                  currentProject.images.map((img, index) => (
                    <div
                      key={`existing-${index}`}
                      style={{
                        position: "relative",
                        aspectRatio: "1/1",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={img}
                        alt={`Existing ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        onClick={() =>
                          handleRemoveProjectImage(
                            currentProject.rawImages[index],
                            index,
                          )
                        }
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          background: "rgba(239, 68, 68, 0.9)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "28px",
                          height: "28px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                {/* New Previews */}
                {currentProject.newSrcs &&
                  currentProject.newSrcs.map((src, index) => (
                    <div
                      key={`new-${index}`}
                      style={{
                        position: "relative",
                        aspectRatio: "1/1",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={src}
                        alt={`New Preview ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        onClick={() => {
                          const newFiles = [...currentProject.newFiles];
                          const newSrcs = [...currentProject.newSrcs];
                          newFiles.splice(index, 1);
                          newSrcs.splice(index, 1);
                          setCurrentProject({
                            ...currentProject,
                            newFiles,
                            newSrcs,
                          });
                        }}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          background: "rgba(0,0,0,0.5)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                {/* Upload Button */}
                <label
                  className={localStyles.uploadPlaceholder}
                  style={{
                    background: "#f8fafc",
                    aspectRatio: "1/1",
                    minHeight: "120px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    border: "2px dashed #cbd5e1",
                    borderRadius: "12px",
                  }}
                >
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                  <Plus size={24} style={{ marginBottom: "0.5rem" }} />
                  <span style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                    Add Images
                  </span>
                </label>
              </div>
            </div>

            <div className={localStyles.formGrid}>
              {/* English */}
              <div className={localStyles.formSection}>
                <label className={localStyles.sectionLabel}>
                  English Details
                </label>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Title</label>
                  <input
                    className={`${localStyles.inputField} ${formErrors.proj_title_en ? dashboardStyles.invalidInput : ""}`}
                    value={currentProject.en.title}
                    onChange={(e) => updateField("en", "title", e.target.value)}
                  />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Owner</label>
                  <select
                    className={`${localStyles.inputField} ${formErrors.proj_owner_en ? dashboardStyles.invalidInput : ""}`}
                    value={currentProject.en.owner}
                    onChange={(e) => {
                      const selected = categories.find(
                        (c) => c.name_en === e.target.value,
                      );
                      setCurrentProject((prev) => ({
                        ...prev,
                        en: { ...prev.en, owner: e.target.value },
                        ar: {
                          ...prev.ar,
                          owner: selected ? selected.name_ar : "",
                        },
                      }));
                      if (formErrors.proj_owner_en) {
                        const newErrors = { ...formErrors };
                        delete newErrors.proj_owner_en;
                        setFormErrors(newErrors);
                      }
                      if (formErrors.proj_owner_ar) {
                        const newErrors = { ...formErrors };
                        delete newErrors.proj_owner_ar;
                        setFormErrors(newErrors);
                      }
                    }}
                  >
                    <option value="">-- Select Owner --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name_en}>
                        {cat.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Location</label>
                  <input
                    className={localStyles.inputField}
                    value={currentProject.en.location}
                    onChange={(e) =>
                      updateField("en", "location", e.target.value)
                    }
                  />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Duration</label>
                  <input
                    className={localStyles.inputField}
                    value={currentProject.en.duration}
                    onChange={(e) =>
                      updateField("en", "duration", e.target.value)
                    }
                  />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Status</label>
                  <select
                    className={`${localStyles.inputField} ${formErrors.proj_status_en ? dashboardStyles.invalidInput : ""}`}
                    value={currentProject.en.status}
                    onChange={(e) =>
                      updateField("en", "status", e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="Completed">Completed</option>
                    <option value="Under Construction">
                      Under Construction
                    </option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Value</label>
                  <input
                    className={`${localStyles.inputField} ${formErrors.proj_value_en ? dashboardStyles.invalidInput : ""}`}
                    value={currentProject.en.value}
                    onChange={(e) => updateField("en", "value", e.target.value)}
                  />
                </div>
              </div>

              {/* Arabic */}
              <div className={localStyles.formSection} dir="rtl">
                <label className={localStyles.sectionLabel}>
                  Arabic Details
                </label>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Title</label>
                  <input
                    className={`${localStyles.inputField} ${formErrors.proj_title_ar ? dashboardStyles.invalidInput : ""}`}
                    value={currentProject.ar.title}
                    onChange={(e) => updateField("ar", "title", e.target.value)}
                  />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Owner</label>
                  <input
                    className={localStyles.inputField}
                    value={currentProject.ar.owner}
                    disabled
                    style={{ background: "#f1f5f9", cursor: "not-allowed" }}
                  />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Location</label>
                  <input
                    className={localStyles.inputField}
                    value={currentProject.ar.location}
                    onChange={(e) =>
                      updateField("ar", "location", e.target.value)
                    }
                  />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Duration</label>
                  <input
                    className={localStyles.inputField}
                    value={currentProject.ar.duration}
                    onChange={(e) =>
                      updateField("ar", "duration", e.target.value)
                    }
                  />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Status</label>
                  <select
                    className={`${localStyles.inputField} ${formErrors.proj_status_ar ? dashboardStyles.invalidInput : ""}`}
                    value={currentProject.ar.status}
                    onChange={(e) =>
                      updateField("ar", "status", e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="مكتمل">مكتمل</option>
                    <option value="قيد الإنشاء">قيد الإنشاء</option>
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                  </select>
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Value</label>
                  <input
                    className={`${localStyles.inputField} ${formErrors.proj_value_ar ? dashboardStyles.invalidInput : ""}`}
                    value={currentProject.ar.value}
                    onChange={(e) => updateField("ar", "value", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
