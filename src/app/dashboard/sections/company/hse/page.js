"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Image as ImageIcon,
  Plus,
  Trash2,
  ShieldCheck,
  HeartPulse,
  Leaf,
  ClipboardCheck,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  createSectionAPI,
  getAllSectionsAPI,
  updateSectionAPI,
  deleteSectionAPI,
  deleteImageAPI,
  BASE_URL,
} from "@/lib/api";
import dashboardStyles from "../../../dashboard.module.css";
import localStyles from "./hse-manager.module.css";
import Modal from "../../../_components/Modal/Modal";
import ImageUpload from "../../../_components/ImageUpload/ImageUpload";
import { confirmDelete } from "@/lib/sweetalert";

export default function HseManager() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [content, setContent] = useState({
    hero: {
      id: null,
      title_en: "",
      title_ar: "",
      bgImage: null,
      rawImage: null,
    },
    purpose: {
      id: null,
      title_en: "",
      title_ar: "",
      text_en: "",
      text_ar: "",
    },
    principles: {
      id: null,
      title_en: "",
      title_ar: "",
      list: [],
    },
    statement: {
      id: null,
      title_en: "",
      title_ar: "",
      intro_en: "",
      intro_ar: "",
      list: [],
    },
    responsibility: {
      id: null,
      title_en: "",
      title_ar: "",
      intro_en: "",
      intro_ar: "",
      footer_en: "",
      footer_ar: "",
      list: [],
    },
  });

  // Image states
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);

  const [activeModal, setActiveModal] = useState(null);
  const [newItem, setNewItem] = useState({ en: "", ar: "" });

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const response = await getAllSectionsAPI();
        if (response.status === 200 && response.data) {
          const hseSections = response.data.filter(
            (s) => s.section_key === "hse",
          );

          // 1. Hero
          const hero = hseSections.find((s) => s.type === "hero");
          if (hero) {
            setContent((prev) => ({
              ...prev,
              hero: {
                id: hero.id,
                title_en: hero.title_en || "",
                title_ar: hero.title_ar || "",
                bgImage: getImageUrl(hero.images?.[0]),
                rawImage: hero.images?.[0] || null,
              },
            }));
          }

          // 2. Purpose
          const purpose = hseSections.find((s) => s.type === "purpose");
          if (purpose) {
            setContent((prev) => ({
              ...prev,
              purpose: {
                id: purpose.id,
                title_en: purpose.title_en || "",
                title_ar: purpose.title_ar || "",
                text_en: purpose.description_en || "",
                text_ar: purpose.description_ar || "",
              },
            }));
          }

          // 3. Principles
          const principlesHeader = hseSections.find(
            (s) => s.type === "principles_header",
          );
          const principlesItems = hseSections.filter(
            (s) => s.type === "principles_item",
          );
          setContent((prev) => ({
            ...prev,
            principles: {
              id: principlesHeader?.id || null,
              title_en: principlesHeader?.title_en || "",
              title_ar: principlesHeader?.title_ar || "",
              list: principlesItems.map((p) => ({
                id: p.id,
                en: p.title_en,
                ar: p.title_ar,
              })),
            },
          }));

          // 4. Statement
          const statementHeader = hseSections.find(
            (s) => s.type === "statement_header",
          );
          const statementItems = hseSections.filter(
            (s) => s.type === "statement_item",
          );
          setContent((prev) => ({
            ...prev,
            statement: {
              id: statementHeader?.id || null,
              title_en: statementHeader?.title_en || "",
              title_ar: statementHeader?.title_ar || "",
              intro_en: statementHeader?.description_en || "",
              intro_ar: statementHeader?.description_ar || "",
              list: statementItems.map((s) => ({
                id: s.id,
                en: s.title_en,
                ar: s.title_ar,
              })),
            },
          }));

          // 5. Responsibility
          const responsibilityHeader = hseSections.find(
            (s) => s.type === "responsibility_header",
          );
          const responsibilityItems = hseSections.filter(
            (s) => s.type === "responsibility_item",
          );

          let respDetails = {};
          try {
            respDetails =
              typeof responsibilityHeader?.details === "string"
                ? JSON.parse(responsibilityHeader.details)
                : responsibilityHeader?.details || {};
          } catch (e) {
            console.error("Failed to parse responsibility details", e);
          }

          setContent((prev) => ({
            ...prev,
            responsibility: {
              id: responsibilityHeader?.id || null,
              title_en: responsibilityHeader?.title_en || "",
              title_ar: responsibilityHeader?.title_ar || "",
              intro_en: responsibilityHeader?.description_en || "",
              intro_ar: responsibilityHeader?.description_ar || "",
              footer_en: respDetails?.footer_en || "",
              footer_ar: respDetails?.footer_ar || "",
              list: responsibilityItems.map((r) => ({
                id: r.id,
                en: r.title_en,
                ar: r.title_ar,
              })),
            },
          }));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleUpdate = (section, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    const errorKey = `${section}_${field}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const removeHeroImage = async () => {
    if (heroImageFile) {
      setHeroImageFile(null);
      setHeroImagePreview(null);
      return;
    }

    if (content.hero.id && content.hero.rawImage) {
      const result = await confirmDelete(
        "Delete Image",
        "Are you sure you want to delete this hero image permanently?",
      );
      if (result.isConfirmed) {
        try {
          await deleteImageAPI(content.hero.id, content.hero.rawImage);
          setContent((prev) => ({
            ...prev,
            hero: { ...prev.hero, bgImage: null, rawImage: null },
          }));
          toast.success("Image deleted successfully");
        } catch (e) {
          console.error(e);
          toast.error("Failed to delete image");
        }
      }
    }
  };

  const handleSaveHero = async () => {
    if (!content.hero.title_en) errors.hero_title_en = true;
    if (!content.hero.title_ar) errors.hero_title_ar = true;
    if (!content.hero.bgImage && !heroImageFile) errors.hero_bgImage = true;

    // if (Object.keys(errors).length > 0) {
    //   setFormErrors(errors);
    //   toast.error("Please fill in all hero banner fields and upload an image");
    //   return;
    // }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("section_key", "hse");
    formData.append("type", "hero");
    formData.append("title_en", content.hero.title_en);
    formData.append("title_ar", content.hero.title_ar);
    formData.append("is_active", "true");

    if (heroImageFile) {
      formData.append("images", heroImageFile);
    }

    try {
      let response;
      if (content.hero.id) {
        response = await updateSectionAPI(content.hero.id, formData);
      } else {
        response = await createSectionAPI(formData);
      }

      if (response && response.data) {
        setContent((prev) => ({
          ...prev,
          hero: {
            ...prev.hero,
            id: response.data.id,
            bgImage: getImageUrl(response.data.images?.[0]),
            rawImage: response.data.images?.[0] || content.hero.rawImage,
          },
        }));
      }
      toast.success("Hero banner saved successfully");
      setHeroImageFile(null);
      setHeroImagePreview(null);
    } catch (error) {
      toast.error("An error occurred while saving the hero banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePurpose = async () => {
    const errors = {};
    if (!content.purpose.title_en) errors.purpose_title_en = true;
    if (!content.purpose.title_ar) errors.purpose_title_ar = true;
    if (!content.purpose.text_en) errors.purpose_text_en = true;
    if (!content.purpose.text_ar) errors.purpose_text_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all purpose fields");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("section_key", "hse");
    formData.append("type", "purpose");
    formData.append("title_en", content.purpose.title_en);
    formData.append("title_ar", content.purpose.title_ar);
    formData.append("description_en", content.purpose.text_en);
    formData.append("description_ar", content.purpose.text_ar);
    formData.append("is_active", "true");

    try {
      if (content.purpose.id) {
        await updateSectionAPI(content.purpose.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("Purpose section saved successfully");
    } catch (error) {
      toast.error("An error occurred while saving purpose");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePrinciplesHeader = async () => {
    if (!content.principles.title_en) errors.principles_title_en = true;
    if (!content.principles.title_ar) errors.principles_title_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in principles header title");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("section_key", "hse");
    formData.append("type", "principles_header");
    formData.append("title_en", content.principles.title_en);
    formData.append("title_ar", content.principles.title_ar);
    formData.append("is_active", "true");

    try {
      if (content.principles.id) {
        await updateSectionAPI(content.principles.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("Principles header saved successfully");
    } catch (error) {
      toast.error("An error occurred while saving principles header");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveStatementHeader = async () => {
    if (!content.statement.title_en) errors.statement_title_en = true;
    if (!content.statement.title_ar) errors.statement_title_ar = true;
    if (!content.statement.intro_en) errors.statement_intro_en = true;
    if (!content.statement.intro_ar) errors.statement_intro_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all policy statement header fields");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("section_key", "hse");
    formData.append("type", "statement_header");
    formData.append("title_en", content.statement.title_en);
    formData.append("title_ar", content.statement.title_ar);
    formData.append("description_en", content.statement.intro_en);
    formData.append("description_ar", content.statement.intro_ar);
    formData.append("is_active", "true");

    try {
      if (content.statement.id) {
        await updateSectionAPI(content.statement.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("Policy statement header saved successfully");
    } catch (error) {
      toast.error("An error occurred while saving policy statement header");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveResponsibilityHeader = async () => {
    if (!content.responsibility.title_en) errors.responsibility_title_en = true;
    if (!content.responsibility.title_ar) errors.responsibility_title_ar = true;
    if (!content.responsibility.intro_en) errors.responsibility_intro_en = true;
    if (!content.responsibility.intro_ar) errors.responsibility_intro_ar = true;
    if (!content.responsibility.footer_en)
      errors.responsibility_footer_en = true;
    if (!content.responsibility.footer_ar)
      errors.responsibility_footer_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all responsibility fields");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("section_key", "hse");
    formData.append("type", "responsibility_header");
    formData.append("title_en", content.responsibility.title_en);
    formData.append("title_ar", content.responsibility.title_ar);
    formData.append("description_en", content.responsibility.intro_en);
    formData.append("description_ar", content.responsibility.intro_ar);
    formData.append("is_active", "true");

    const details = {
      footer_en: content.responsibility.footer_en,
      footer_ar: content.responsibility.footer_ar,
    };
    formData.append("details", JSON.stringify(details));

    try {
      if (content.responsibility.id) {
        await updateSectionAPI(content.responsibility.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("Responsibility header saved successfully");
    } catch (error) {
      toast.error("An error occurred while saving responsibility header");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItemFromModal = async () => {
    const errors = {};
    if (!newItem.en) errors.modal_en = true;
    if (!newItem.ar) errors.modal_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in both English and Arabic content");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const type = `${activeModal}_item`;

    const formData = new FormData();
    formData.append("section_key", "hse");
    formData.append("type", type);
    formData.append("title_en", newItem.en);
    formData.append("title_ar", newItem.ar);
    formData.append("is_active", "true");

    try {
      const response = await createSectionAPI(formData);
      const addedItem = {
        id: response.data.id,
        en: newItem.en,
        ar: newItem.ar,
      };

      handleUpdate(activeModal, "list", [
        ...content[activeModal].list,
        addedItem,
      ]);

      toast.success("Item added successfully");
      setActiveModal(null);
      setNewItem({ en: "", ar: "" });
    } catch (error) {
      toast.error("An error occurred while adding item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeListItem = async (section, id, index) => {
    if (!id) return;

    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await deleteSectionAPI(id);
        const newList = content[section].list.filter((_, i) => i !== index);
        handleUpdate(section, "list", newList);
        toast.success("Item deleted successfully");
      } catch (error) {
        toast.error("An error occurred while deleting");
      }
    }
  };

  const updateListItem = (section, index, lang, value) => {
    const newList = [...content[section].list];
    newList[index] = { ...newList[index], [lang]: value };
    handleUpdate(section, "list", newList);

    const errorKey = `${section}_${index}_${lang}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const saveListItem = async (section, index) => {
    const item = content[section].list[index];
    if (!item.id) return;

    const errors = {};
    if (!item.en) errors[`${section}_${index}_en`] = true;
    if (!item.ar) errors[`${section}_${index}_ar`] = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Content cannot be empty");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const type = `${section}_item`;

    const formData = new FormData();
    formData.append("section_key", "hse");
    formData.append("type", type);
    formData.append("title_en", item.en);
    formData.append("title_ar", item.ar);
    formData.append("is_active", "true");

    try {
      await updateSectionAPI(item.id, formData);
      toast.success("Item updated successfully");
    } catch (error) {
      toast.error("An error occurred while updating");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#64748b",
        }}
      >
        <p>Loading HSE Policy Management...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>
            HSE Policy Management
          </h2>
          <p className={dashboardStyles.sectionSubtitle}>
            Manage the Health, Safety, and Environmental policy content.
          </p>
        </div>
      </div>

      <div className={localStyles.sectionGrid}>
        {/* Banner Section */}
        <div className={dashboardStyles.contentCard}>
          <div className={localStyles.cardHeader}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <ShieldCheck size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Hero Banner</h3>
            </div>
            <button
              onClick={handleSaveHero}
              disabled={isSubmitting}
              className={localStyles.saveButton}
              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            >
              <Save size={16} /> {isSubmitting ? "Saving..." : "Save Banner"}
            </button>
          </div>
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Page Title (EN)</label>
              <input
                value={content.hero.title_en}
                onChange={(e) =>
                  handleUpdate("hero", "title_en", e.target.value)
                }
                className={`${localStyles.inputField} ${formErrors.hero_title_en ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                عنوان الصفحة (AR)
              </label>
              <input
                value={content.hero.title_ar}
                onChange={(e) =>
                  handleUpdate("hero", "title_ar", e.target.value)
                }
                className={`${localStyles.inputField} ${formErrors.hero_title_ar ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
          </div>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Banner Image</label>
            <ImageUpload
              value={heroImagePreview || content.hero.bgImage}
              mode="hero"
              height="180px"
              onChange={(file) => {
                setHeroImageFile(file);
                setHeroImagePreview(URL.createObjectURL(file));
                if (formErrors.hero_bgImage) {
                  const newErrors = { ...formErrors };
                  delete newErrors.hero_bgImage;
                  setFormErrors(newErrors);
                }
              }}
              onDelete={removeHeroImage}
            />
            {formErrors.hero_bgImage && (
              <div
                style={{
                  border: "2px solid #DC143C",
                  borderRadius: "12px",
                  marginTop: "-181px",
                  height: "181px",
                  pointerEvents: "none",
                }}
              ></div>
            )}
          </div>
        </div>

        {/* Purpose Section */}
        <div className={dashboardStyles.contentCard}>
          <div className={localStyles.cardHeader}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <HeartPulse size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Purpose</h3>
            </div>
            <button
              onClick={handleSavePurpose}
              disabled={isSubmitting}
              className={localStyles.saveButton}
              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            >
              <Save size={16} /> {isSubmitting ? "Saving..." : "Save Purpose"}
            </button>
          </div>
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Purpose Title (EN)
              </label>
              <input
                value={content.purpose.title_en}
                onChange={(e) =>
                  handleUpdate("purpose", "title_en", e.target.value)
                }
                className={`${localStyles.inputField} ${formErrors.purpose_title_en ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Purpose Title (AR)
              </label>
              <input
                value={content.purpose.title_ar}
                onChange={(e) =>
                  handleUpdate("purpose", "title_ar", e.target.value)
                }
                className={`${localStyles.inputField} ${formErrors.purpose_title_ar ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
          </div>
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Purpose Text (EN)
              </label>
              <textarea
                rows="4"
                value={content.purpose.text_en}
                onChange={(e) =>
                  handleUpdate("purpose", "text_en", e.target.value)
                }
                className={`${localStyles.textareaField} ${formErrors.purpose_text_en ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Purpose Text (AR)
              </label>
              <textarea
                rows="4"
                value={content.purpose.text_ar}
                onChange={(e) =>
                  handleUpdate("purpose", "text_ar", e.target.value)
                }
                className={`${localStyles.textareaField} ${formErrors.purpose_text_ar ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
          </div>
        </div>

        {/* Principles Section */}
        <div className={dashboardStyles.contentCard}>
          <div className={localStyles.cardHeader}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <Leaf size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Principles</h3>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={handleSavePrinciplesHeader}
                disabled={isSubmitting}
                className={localStyles.saveButton}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  backgroundColor: "#64748b",
                }}
              >
                <Save size={16} /> Save Header
              </button>
              <button
                onClick={() => setActiveModal("principles")}
                className={localStyles.saveButton}
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                <Plus size={16} /> Add Principle
              </button>
            </div>
          </div>
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Section Title (EN)
              </label>
              <input
                value={content.principles.title_en}
                onChange={(e) =>
                  handleUpdate("principles", "title_en", e.target.value)
                }
                className={`${localStyles.inputField} ${formErrors.principles_title_en ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Principles Title (AR)
              </label>
              <input
                value={content.principles.title_ar}
                onChange={(e) =>
                  handleUpdate("principles", "title_ar", e.target.value)
                }
                className={`${localStyles.inputField} ${formErrors.principles_title_ar ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
          </div>
          <div className={localStyles.listManager}>
            <label className={localStyles.fieldLabel}>Principles List</label>
            <div className={localStyles.scrollableList}>
              {content.principles.list.map((item, idx) => (
                <div key={item.id || idx} className={localStyles.listItem}>
                  <textarea
                    rows="3"
                    value={item.en}
                    onChange={(e) =>
                      updateListItem("principles", idx, "en", e.target.value)
                    }
                    className={`${localStyles.textareaField} ${formErrors[`principles_${idx}_en`] ? dashboardStyles.invalidInput : ""}`}
                  />
                  <div dir="rtl">
                    <textarea
                      rows="3"
                      value={item.ar}
                      onChange={(e) =>
                        updateListItem("principles", idx, "ar", e.target.value)
                      }
                      className={`${localStyles.textareaField} ${formErrors[`principles_${idx}_ar`] ? dashboardStyles.invalidInput : ""}`}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => saveListItem("principles", idx)}
                      className={localStyles.saveBtn}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        fontSize: "0.8rem",
                      }}
                    >
                      <Save size={16} color="#22c55e" /> حفظ واعتماد
                    </button>
                    <button
                      onClick={() => removeListItem("principles", item.id, idx)}
                      className={localStyles.removeBtn}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Policy Statement Section */}
        <div className={dashboardStyles.contentCard}>
          <div className={localStyles.cardHeader}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <Info size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Policy Statement</h3>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={handleSaveStatementHeader}
                disabled={isSubmitting}
                className={localStyles.saveButton}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  backgroundColor: "#64748b",
                }}
              >
                <Save size={16} /> Save Header
              </button>
              <button
                onClick={() => setActiveModal("statement")}
                className={localStyles.saveButton}
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                <Plus size={16} /> Add Commitment
              </button>
            </div>
          </div>
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Policy Statement Title (EN)
              </label>
              <input
                value={content.statement.title_en}
                onChange={(e) =>
                  handleUpdate("statement", "title_en", e.target.value)
                }
                className={`${localStyles.inputField} ${formErrors.statement_title_en ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Policy Statement Title (AR)
              </label>
              <input
                value={content.statement.title_ar}
                onChange={(e) =>
                  handleUpdate("statement", "title_ar", e.target.value)
                }
                className={`${localStyles.inputField} ${formErrors.statement_title_ar ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
          </div>
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Intro (EN)</label>
              <textarea
                rows="2"
                value={content.statement.intro_en}
                onChange={(e) =>
                  handleUpdate("statement", "intro_en", e.target.value)
                }
                className={`${localStyles.textareaField} ${formErrors.statement_intro_en ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Intro (AR)</label>
              <textarea
                rows="2"
                value={content.statement.intro_ar}
                onChange={(e) =>
                  handleUpdate("statement", "intro_ar", e.target.value)
                }
                className={`${localStyles.textareaField} ${formErrors.statement_intro_ar ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
          </div>
          <div className={localStyles.listManager}>
            <label className={localStyles.fieldLabel}>
              Commitments List (Scrollable)
            </label>
            <div className={localStyles.scrollableList}>
              {content.statement.list.map((item, idx) => (
                <div key={item.id || idx} className={localStyles.listItem}>
                  <textarea
                    rows="3"
                    value={item.en}
                    onChange={(e) =>
                      updateListItem("statement", idx, "en", e.target.value)
                    }
                    className={`${localStyles.textareaField} ${formErrors[`statement_${idx}_en`] ? dashboardStyles.invalidInput : ""}`}
                  />
                  <div dir="rtl">
                    <textarea
                      rows="3"
                      value={item.ar}
                      onChange={(e) =>
                        updateListItem("statement", idx, "ar", e.target.value)
                      }
                      className={`${localStyles.textareaField} ${formErrors[`statement_${idx}_ar`] ? dashboardStyles.invalidInput : ""}`}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => saveListItem("statement", idx)}
                      className={localStyles.saveBtn}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        fontSize: "0.8rem",
                      }}
                    >
                      <Save size={16} color="#22c55e" /> حفظ واعتماد
                    </button>
                    <button
                      onClick={() => removeListItem("statement", item.id, idx)}
                      className={localStyles.removeBtn}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Responsibility Section */}
        <div className={dashboardStyles.contentCard}>
          <div className={localStyles.cardHeader}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <ClipboardCheck size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Responsibility</h3>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={handleSaveResponsibilityHeader}
                disabled={isSubmitting}
                className={localStyles.saveButton}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  backgroundColor: "#64748b",
                }}
              >
                <Save size={16} /> Save Header
              </button>
              <button
                onClick={() => setActiveModal("responsibility")}
                className={localStyles.saveButton}
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
          </div>
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Section Title (EN)
              </label>
              <input
                value={content.responsibility.title_en}
                onChange={(e) =>
                  handleUpdate("responsibility", "title_en", e.target.value)
                }
                className={`${localStyles.inputField} ${formErrors.responsibility_title_en ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Responsibility Title (AR)
              </label>
              <input
                value={content.responsibility.title_ar}
                onChange={(e) =>
                  handleUpdate("responsibility", "title_ar", e.target.value)
                }
                className={`${localStyles.inputField} ${formErrors.responsibility_title_ar ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
          </div>
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Intro (EN)</label>
              <textarea
                rows="2"
                value={content.responsibility.intro_en}
                onChange={(e) =>
                  handleUpdate("responsibility", "intro_en", e.target.value)
                }
                className={`${localStyles.textareaField} ${formErrors.responsibility_intro_en ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Intro (AR)</label>
              <textarea
                rows="2"
                value={content.responsibility.intro_ar}
                onChange={(e) =>
                  handleUpdate("responsibility", "intro_ar", e.target.value)
                }
                className={`${localStyles.textareaField} ${formErrors.responsibility_intro_ar ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
          </div>
          <div className={localStyles.listManager}>
            <label className={localStyles.fieldLabel}>
              Responsibility Commitments List
            </label>
            <div className={localStyles.scrollableList}>
              {content.responsibility.list.map((item, idx) => (
                <div key={item.id || idx} className={localStyles.listItem}>
                  <textarea
                    rows="3"
                    value={item.en}
                    onChange={(e) =>
                      updateListItem(
                        "responsibility",
                        idx,
                        "en",
                        e.target.value,
                      )
                    }
                    className={`${localStyles.textareaField} ${formErrors[`responsibility_${idx}_en`] ? dashboardStyles.invalidInput : ""}`}
                  />
                  <div dir="rtl">
                    <textarea
                      rows="3"
                      value={item.ar}
                      onChange={(e) =>
                        updateListItem(
                          "responsibility",
                          idx,
                          "ar",
                          e.target.value,
                        )
                      }
                      className={`${localStyles.textareaField} ${formErrors[`responsibility_${idx}_ar`] ? dashboardStyles.invalidInput : ""}`}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => saveListItem("responsibility", idx)}
                      className={localStyles.saveBtn}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        fontSize: "0.8rem",
                      }}
                    >
                      <Save size={16} color="#22c55e" /> حفظ واعتماد
                    </button>
                    <button
                      onClick={() =>
                        removeListItem("responsibility", item.id, idx)
                      }
                      className={localStyles.removeBtn}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={localStyles.formGrid} style={{ marginTop: "1.5rem" }}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Footer Quote (EN)
              </label>
              <textarea
                rows="2"
                value={content.responsibility.footer_en}
                onChange={(e) =>
                  handleUpdate("responsibility", "footer_en", e.target.value)
                }
                className={`${localStyles.textareaField} ${formErrors.responsibility_footer_en ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                Footer Quote (AR)
              </label>
              <textarea
                rows="2"
                value={content.responsibility.footer_ar}
                onChange={(e) =>
                  handleUpdate("responsibility", "footer_ar", e.target.value)
                }
                className={`${localStyles.textareaField} ${formErrors.responsibility_footer_ar ? dashboardStyles.invalidInput : ""}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Modal Implementation */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={`Add New ${activeModal ? activeModal.charAt(0).toUpperCase() + activeModal.slice(1) : ""} Item`}
        footer={
          <>
            <button
              onClick={() => setActiveModal(null)}
              className={localStyles.cancelBtn}
            >
              Cancel
            </button>
            <button
              onClick={handleAddItemFromModal}
              className={localStyles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Item"}
            </button>
          </>
        }
      >
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>
            Description (English)
          </label>
          <textarea
            className={localStyles.textareaField}
            value={newItem.en}
            onChange={(e) => setNewItem({ ...newItem, en: e.target.value })}
            placeholder="Enter description in English..."
            rows="4"
          />
        </div>
        <div className={localStyles.inputGroup} dir="rtl">
          <label className={localStyles.fieldLabel}>الوصف (بالعربية)</label>
          <textarea
            className={localStyles.textareaField}
            value={newItem.ar}
            onChange={(e) => setNewItem({ ...newItem, ar: e.target.value })}
            placeholder="أدخل الوصف بالعربية..."
            rows="4"
          />
        </div>
      </Modal>
    </motion.div>
  );
}
