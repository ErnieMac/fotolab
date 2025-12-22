import { EditorLayout } from "@/components/EditorLayout";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>PixelForge - Simple Photo & Graphic Editor</title>
        <meta name="description" content="A fast, browser-based photo and graphic editor. Resize, crop, and export images with an intuitive interface designed for designers and photographers." />
      </Helmet>
      <EditorLayout />
    </>
  );
};

export default Index;
