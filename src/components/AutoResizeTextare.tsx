import { Textarea } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

interface Props {
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AutoResizeTextarea = ({ value, onChange }: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [value]);

    return (
        <Textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            overflow="hidden"
            resize="none"
        />
    );
};

export default AutoResizeTextarea;
