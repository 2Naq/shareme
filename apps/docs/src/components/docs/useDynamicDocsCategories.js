import { useMemo } from "react";
import { useAllDocsData } from "@docusaurus/plugin-content-docs/client";
import { categorys } from "@site/src/constants/category";

// High resolution preview cover images for brands
const FOLDER_IMAGES = {
  mitsubishi:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
  omron:
    "https://images.unsplash.com/photo-1581092162384-8987c1d64718?q=80&w=800&auto=format&fit=crop",
  wecon:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
  temperature:
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop",
  siemens:
    "https://images.unsplash.com/photo-1620325867502-221ddb5b4d75?q=80&w=800&auto=format&fit=crop",
};

export function formatFolderName(name) {
  if (!name) return "";
  const lower = name.toLowerCase();
  if (lower === "omron") return "OMRON";
  if (lower === "wecon") return "WECON";
  if (lower === "plc") return "PLC";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Custom hook to dynamically parse and group Docusaurus docs by category & folder
 */
export function useDynamicDocsCategories() {
  const allDocsData = useAllDocsData();
  console.log("allDocsData", allDocsData);
  return useMemo(() => {
    return categorys.map((cat) => {
      const pluginData = allDocsData[cat.id];
      const docs = pluginData?.versions?.[0]?.docs || [];

      const folderGroups = {};
      const rootDocs = [];

      docs.forEach((doc) => {
        const cleanId = doc.id.replace(/^\//, "");
        const parts = cleanId.split("/");

        if (parts.length > 1 && parts[0].trim() !== "") {
          const folderKey = parts[0];
          if (!folderGroups[folderKey]) {
            folderGroups[folderKey] = [];
          }
          folderGroups[folderKey].push(doc);
        } else {
          rootDocs.push(doc);
        }
      });

      const items = [];

      // 1. Grouped subfolder items
      Object.keys(folderGroups).forEach((folderKey) => {
        const folderDocs = folderGroups[folderKey];
        const formattedTitle = formatFolderName(folderKey);

        const articleTitles = folderDocs.map((d) => d.title).join(", ");
        const autoDesc = `Tổng hợp ${folderDocs.length} bài viết về ${formattedTitle}: ${articleTitles}`;

        items.push({
          id: `${cat.id}-${folderKey}`,
          title: `${cat.label} ${formattedTitle}`,
          folderName: folderKey,
          description: autoDesc,
          tags: [cat.label, formattedTitle, `${folderDocs.length} bài viết`],
          link: folderDocs[0]?.path || `/${cat.routeBasePath || cat.id}`,
          image:
            FOLDER_IMAGES[folderKey.toLowerCase()] ||
            cat.image ||
            "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
          badge: `${folderDocs.length} bài viết`,
          badgeColor: "bg-primary/10 text-primary border-primary/20",
        });
      });

      // 2. Root docs (e.g. intro)
      rootDocs.forEach((doc) => {
        items.push({
          id: `${cat.id}-${doc.id}`,
          title: doc.title || `Tổng quan ${cat.label}`,
          folderName: doc.id,
          description:
            doc.description ||
            cat.description ||
            `Tài liệu tổng quan bài viết ${cat.label}`,
          tags: [cat.label, "Tổng quan"],
          link: doc.path,
          image:
            cat.image ||
            "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
          badge: "Tổng quan",
          badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        });
      });

      return {
        id: cat.id,
        title: `${cat.label} - ${cat.description || "Tài liệu kỹ thuật"}`,
        description: cat.description,
        icon: cat.id,
        items,
      };
    });
  }, [allDocsData]);
}
