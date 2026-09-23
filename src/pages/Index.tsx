import { EditorLayout } from "@/components/EditorLayout";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>FotoLab — Personal Photo & Graphic Editor</title>
        <meta name="description" content="A fast, private browser-based studio for cropping, resizing, layering, and exporting images." />
      </Helmet>
      <EditorLayout />
    </>
  );
};

export default Index;
