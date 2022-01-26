import React from "react";
import { Picker } from "emoji-mart";
import { useEffect, useRef } from "react";

function EmojiPicker({ showEmoji, onEmojiClick, closeEmojiModal }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClose);

    function handleClose(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        event.target.id !== "emojiButton" &&
        event.target.id !== "textAreaZone"
      ) {
        closeEmojiModal();
      }
    }

    return () => document.removeEventListener("click", handleClose);
  }, [closeEmojiModal]);

  return (
    <div ref={wrapperRef}>
      <Picker
        style={{
          position: "absolute",
          bottom: 88,
          marginInlineStart: "5px",
          zIndex: "999",
          width: "250px",
          display: showEmoji ? "block" : "none",
        }}
        emojiSize={21}
        showSkinTones={false}
        showPreview={false}
        onClick={onEmojiClick}
        exclude={["flags"]}
        native={true}
      />
    </div>
  );
}

export default EmojiPicker;
