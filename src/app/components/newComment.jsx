"use client";

import React, { useState } from "react";
import Image from "next/image";

const NewComment = ({ onAddComment, currentUser }) => {
  const [newComment, setNewComment] = useState("");

  const userImg = currentUser?.image.png.substring(1);

  const handleNewComment = () => {
    const now = Date.now();
    /*new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }); para publicar fecha de creacion sin timestamp */
    const newCommentPost = {
      id: Date.now(),
      content: newComment,
      createdAt: now,
      score: 0,
      user: currentUser,
      replies: [],
    };
    // Verifica si el comentario no está vacío antes de agregarlo
    if (newComment.trim() !== "") {
      onAddComment(newCommentPost);
      setNewComment("");
    }
  };

  return (
    <div className="bg-white rounded-lg grid grid-flow-row md:grid-flow-col md:justify-between w-[350px] md:w-[750px] my-2 p-5 text-slate-500 ">
      <div className="hidden md:block">
        <Image
          src={userImg}
          alt="img not found"
          width={50}
          height={50}
          className="w-10 h-auto"
        />
      </div>

      <textarea
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder={`Add a comment...`}
        maxLength={300}
        className="min-h-[100px] w-[310px] md:w-[550px] border-2 border-blue-600 rounded-lg p-2 "
        style={{ resize: "none" }}
      />
      <div className="flex md:hidden flex-row justify-between w-[310px] mt-2">
        <Image
          src={userImg}
          alt="img not found"
          width={50}
          height={50}
          className="w-10 h-auto"
        />
        <button
          className="bg-blue-600 rounded-lg w-[90px] h-[40px] text-white transition-colors duration-300 filter  hover:bg-blue-300 "
          onClick={handleNewComment}
        >
          SEND
        </button>
      </div>
      <button
        className="bg-blue-600 rounded-lg hidden md:block w-[90px] h-[40px] text-white transition-colors duration-300 filter  hover:bg-blue-300 "
        onClick={handleNewComment}
      >
        SEND
      </button>
    </div>
  );
};

export default NewComment;
