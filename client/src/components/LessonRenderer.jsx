import HeadingBlock from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import CodeBlock from "./blocks/CodeBlock";
import VideoBlock from "./blocks/VideoBlock";
import MCQBlock from "./blocks/MCQBlock";

const LessonRenderer = ({ content }) => {
  if (!content || content.length === 0) {
    return null;
  }

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "heading":
        return <HeadingBlock key={index} text={block.text} />;
      case "paragraph":
        return <ParagraphBlock key={index} text={block.text} />;
      case "code":
        return (
          <CodeBlock key={index} language={block.language} code={block.text} />
        );
      case "video":
        return <VideoBlock key={index} query={block.query} url={block.url} />;
      case "mcq":
        return (
          <MCQBlock
            key={index}
            question={block.question}
            options={block.options}
            answer={block.answer}
            explanation={block.explanation}
          />
        );
      default:
        return null;
    }
  };

  return <>{content.map((block, index) => renderBlock(block, index))}</>;
};

export default LessonRenderer;
