"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

const Comment = ({
  comment,
  currentUser,
  onSendReply,
  parentCommentId,
  onEditComment,
  onDeleteComment,
  onVoteComment,
}) => {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false); //Reply, estado para manejar el cuadro de respuesta
  const [editing, setEditing] = useState(false); //Edit, estado que activa la edicion
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  const userImg = comment.user?.image.png.substring(1);
  const currentUserImg = currentUser?.image.png.substring(1);

  useEffect(() => {
    // Verifica si el usuario actual ya votó por este comentario
    const userVote = currentUser.votes?.find(
      (vote) => vote.commentId === comment.id
    );

    if (userVote) {
      if (userVote.voted === "up") {
        setUpvoted(true);
        setDownvoted(false);
      } else if (userVote.voted === "down") {
        setDownvoted(true);
        setUpvoted(false);
      }
    }
  }, [comment.id, currentUser.votes]);

  //VOTES
  const handleUpvote = () => {
    if (!upvoted) {
      onVoteComment(comment.id, "up");
      setUpvoted(true);
      setDownvoted(false);
    }
  };

  const handleDownvote = () => {
    if (!downvoted) {
      onVoteComment(comment.id, "down");
      setDownvoted(true);
      setUpvoted(false);
    }
  };

  //EDIT
  const handleEdit = () => {
    setEditing(true);
  };

  const handleSaveEdit = () => {
    console.log("Edicion del mensaje a:" + editedContent);
    // Llamar a la función proporcionada desde Comments para guardar la edición del comentario
    onEditComment(comment.id, editedContent);

    // Cerrar el cuadro de edición
    setEditing(false);
  };

  //DELETE
  const handleDelete = () => {
    // Lógica para eliminar el comentario
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    // Llamar a la función proporcionada para eliminar el comentario
    onDeleteComment(comment.id);
    // Cerrar el modal después de confirmar el delete
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    // Cerrar el modal sin eliminar el comentario
    setShowModal(false);
  };

  //REPLY
  const handleReply = () => {
    if (isReplying) {
      setIsReplying(false);
    } else {
      setIsReplying(true);
    }
  };

  const handleSendReply = () => {
    // Crear la nueva respuesta
    const now = Date.now();
    /*new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }); para publicar fecha de creacion sin timestamp*/
    const newReply = {
      id: Date.now(),
      content: replyText,
      createdAt: now,
      score: 0,
      replyingTo: comment.user.username,
      user: currentUser,
    };
    console.log("se crea la reply a:  " + newReply.replyingTo);
    // Llamar a la función proporcionada desde Comments para enviar la respuesta
    onSendReply(parentCommentId, newReply);

    // Limpiar el texto de la respuesta después de enviarla
    setReplyText("");
    // Cerrar el cuadro de respuesta
    setIsReplying(false);
  };

  //TIME
  const calculateTimeSincePost = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const timeDifference = now.getTime() - postTime.getTime();

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  };

  const timestamp = comment.createdAt; // Marca de tiempo del comentario o respuesta
  const timeSincePost = calculateTimeSincePost(timestamp);

  const width = comment.replyingTo
    ? "w-[320px] md:w-[650px]"
    : "w-[350px] md:w-[750px]";
  const width2 = comment.replyingTo
    ? "w-[280px] md:w-[550px]"
    : "w-[310px] md:w-[650px]";
  const textWidth = comment.replyingTo
    ? " w-[280px] md:w-[450px]"
    : "w-[310px] md:w-[500px]";

  /*
  Blue tag in future replies, but not in the already replied comments 

  const [replyText, setReplyText] = useState(`@${comment.user.username ? comment.user.username : ""} `);
  
  const formattedContent = comment.content.replace(
    /^(@\w+)/,
    '<span class="text-blue-500 font-semibold ">$1</span>'
  );
  <p dangerouslySetInnerHTML={{ __html: formattedContent }}></p>; */

  return (
    <div className={` flex flex-col ${width} text-slate-500  my-2`}>
      <div
        className={`bg-white rounded-lg grid grid-flow-col justify-between p-5 ${width}`}
      >
        {/* VOTES*/}
        <div className="hidden md:flex flex-col bg-slate-100 w-[32px] h-[90px] justify-items-center rounded-lg mx-2 mt-2 text-blue-600 font-bold">
          <button
            className=" w-5 h-5 mx-[11px] my-2"
            onClick={handleUpvote}
            disabled={upvoted}
          >
            <svg
              width="15"
              height="15"
              xmlns="http://www.w3.org/2000/svg"
              className={`w-auto h-auto transition-colors duration-200 fill-current text-gray-400 ${
                upvoted ? `` : `hover:text-blue-600`
              }`}
            >
              <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" />
            </svg>
          </button>

          <div className="  flex justify-center px-3">
            <span> {comment.score}</span>
          </div>
          <button
            className=" w-5 h-5 mx-[11px] my-2"
            onClick={handleDownvote}
            disabled={downvoted}
          >
            <svg
              width="15"
              height="5"
              xmlns="http://www.w3.org/2000/svg"
              className={`w-auto h-auto transition-colors duration-200 fill-current text-gray-400 ${
                downvoted ? `` : `hover:text-blue-600`
              }`}
            >
              <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" />
            </svg>
          </button>
        </div>
        {/*MAIN DIV*/}
        <div className={` ${width2}`}>
          <div className={`flex flex-row h-7 justify-between my-2 ${width2}`}>
            <div className="grid grid-flow-col h-7 justify-start items-center">
              <div className="">
                <Image
                  src={userImg}
                  alt="img not found"
                  width={50}
                  height={50}
                  className="w-7 h-auto"
                />
              </div>
              <span className=" text-black font-semibold ml-3 text-sm md:text-base">
                {comment.user.username}
              </span>
              {currentUser.username === comment.user.username ? (
                <div className=" bg-blue-600 text-white font-semibold rounded w-10 md:w-12 mx-1 md:mx-2 my-1 text-center text-sm md:text-base">
                  you
                </div>
              ) : (
                <></>
              )}
              <span className="ml-2 text-sm md:text-base md:ml-4">
                {timeSincePost}
              </span>
            </div>
            {/* CONDITIONAL REPLY-EDIT-DELETE */}
            {currentUser.username !== comment.user.username ? (
              <div className=" hidden md:flex flex-row items-center place-self-end  h-7">
                <button
                  className="flex flex-row items-center font-bold text-blue-600 h-7 ml-2 transition-all duration-300 filter  hover:brightness-150"
                  onClick={handleReply}
                >
                  <Image
                    src="/images/icon-reply.svg"
                    alt="img not found"
                    width={30}
                    height={30}
                    className="flex w-4 h-4 mx-1 "
                  />
                  Reply
                </button>
              </div>
            ) : (
              <>
                <div className="hidden md:grid grid-flow-col h-7 justify-end ">
                  <div className="">
                    <button
                      className=" flex flex-row items-center font-bold text-red-600 h-7 ml-2  transition-all duration-300 filter  hover:text-red-400 hover:brightness-150"
                      onClick={handleDelete}
                    >
                      <Image
                        src="/images/icon-delete.svg"
                        alt="img not found"
                        width={30}
                        height={30}
                        className="flex w-4 h-4 mx-1"
                      />
                      Delete
                    </button>
                    {/* MODAL */}
                    {showModal && (
                      <div className="fixed inset-0 flex items-center justify-center z-10 bg-black/50">
                        <div className=" bg-white rounded-lg  w-[400px] h-[270px] p-9">
                          <h1 className=" font-bold text-2xl text-gray-700">
                            Delete comment
                          </h1>
                          <p className=" my-6">
                            Are you sure you want to delete this comment? This
                            will remove this comment and can't be undone
                          </p>
                          <div className="flex flex-row justify-between">
                            <button
                              className=" bg-slate-400 rounded-lg w-[150px] h-[50px] text-white font-semibold transition-colors duration-300 filter  hover:bg-slate-600 "
                              onClick={handleCancelDelete}
                            >
                              NO, CANCEL
                            </button>
                            <button
                              className=" bg-red-400 rounded-lg w-[150px] h-[50px] text-white font-semibold transition-colors duration-300 filter  hover:bg-red-600"
                              onClick={handleConfirmDelete}
                            >
                              YES, DELETE
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className=" ml-4 ">
                    <button
                      className=" flex flex-row items-center  font-bold text-blue-600 h-7 ml-2 transition-all duration-300 filter  hover:brightness-150 "
                      onClick={handleEdit}
                    >
                      <Image
                        src="/images/icon-edit.svg"
                        alt="img not found"
                        width={30}
                        height={30}
                        className="flex w-4 h-4 mx-1"
                      />
                      Edit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/*EDIT/COMMENT */}
          {editing ? (
            <div className="flex flex-col items-end">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                maxLength={300}
                className={`min-h-[100px]  border-2 border-blue-600 rounded-lg p-2 ${width2}`}
                style={{ resize: "none" }}
              />
              <button
                className=" bg-blue-600 rounded-lg w-[90px] h-[40px] text-white mt-2 transition-colors duration-300 filter  hover:bg-blue-300 "
                onClick={handleSaveEdit}
              >
                UPDATE
              </button>
            </div>
          ) : (
            <div>
              {/*SHOW COMMENT*/}
              <p className={` break-words  ${width2}`}>
                {comment.replyingTo ? (
                  <>
                    <span className="text-blue-500 font-semibold">
                      @{comment.replyingTo}
                    </span>{" "}
                    {comment.content}
                  </>
                ) : (
                  comment.content
                )}
              </p>
            </div>
          )}
          {/*MOBILE BOTTOM BUTTONS*/}
          <div
            className={`flex flex-row md:hidden mt-5 justify-between items-center ${width2}`}
          >
            {/*MOBILE VOTES*/}
            <div className="flex flex-row bg-slate-100 w-[90px] h-[32px] align-middle justify-between rounded-lg mt-2 text-blue-600 font-bold">
              <button
                className=" w-[30px] h-5  p-[10px]"
                onClick={handleUpvote}
                disabled={upvoted}
              >
                <svg
                  width="15"
                  height="15"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-auto h-auto transition-colors duration-200 fill-current text-gray-400 ${
                    upvoted ? `` : `hover:text-blue-600`
                  }`}
                >
                  <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" />
                </svg>
              </button>

              <div className=" w-[30px]  flex justify-center p-1">
                <span> {comment.score}</span>
              </div>
              <button
                className=" w-[30px] h-5 p-[14px]"
                onClick={handleDownvote}
                disabled={downvoted}
              >
                <svg
                  width="15"
                  height="5"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-auto h-auto transition-colors duration-200 fill-current text-gray-400 ${
                    downvoted ? `` : `hover:text-blue-600`
                  }`}
                >
                  <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" />
                </svg>
              </button>
            </div>
            {currentUser.username !== comment.user.username ? (
              <div className="flex flex-row items-center place-self-end  h-7">
                <button
                  className="flex flex-row items-center font-bold text-blue-600 h-7 ml-2 transition-all duration-300 filter  hover:brightness-150"
                  onClick={handleReply}
                >
                  <Image
                    src="/images/icon-reply.svg"
                    alt="img not found"
                    width={30}
                    height={30}
                    className="flex w-4 h-4 mx-1 "
                  />
                  Reply
                </button>
              </div>
            ) : (
              <div className="flex flex-row items-center place-self-end  h-7 ">
                <div className="">
                  <button
                    className=" flex flex-row items-center font-bold text-red-600 h-7 ml-2  transition-all duration-300 filter  hover:text-red-400 hover:brightness-150"
                    onClick={handleDelete}
                  >
                    <Image
                      src="/images/icon-delete.svg"
                      alt="img not found"
                      width={30}
                      height={30}
                      className="flex w-4 h-4 mx-1"
                    />
                    Delete
                  </button>
                  {/*MOBILE MODAL */}
                  {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-10 bg-black/50">
                      <div className=" bg-white rounded-lg  w-[400px] h-[270px] p-9">
                        <h1 className=" font-bold text-2xl text-gray-700">
                          Delete comment
                        </h1>
                        <p className=" my-6">
                          Are you sure you want to delete this comment? This
                          will remove this comment and can't be undone
                        </p>
                        <div className="flex flex-row justify-between">
                          <button
                            className=" bg-slate-400 rounded-lg w-[150px] h-[50px] text-white font-semibold transition-colors duration-300 filter  hover:bg-slate-600 "
                            onClick={handleCancelDelete}
                          >
                            NO, CANCEL
                          </button>
                          <button
                            className=" bg-red-400 rounded-lg w-[150px] h-[50px] text-white font-semibold transition-colors duration-300 filter  hover:bg-red-600"
                            onClick={handleConfirmDelete}
                          >
                            YES, DELETE
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className=" ml-4 ">
                  <button
                    className=" flex flex-row items-center  font-bold text-blue-600 h-7 ml-2 transition-all duration-300 filter  hover:brightness-150 "
                    onClick={handleEdit}
                  >
                    <Image
                      src="/images/icon-edit.svg"
                      alt="img not found"
                      width={30}
                      height={30}
                      className="flex w-4 h-4 mx-1"
                    />
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*REPLY */}
      {isReplying && (
        <div
          className={`bg-white rounded-lg flex flex-col md:flex-row justify-between my-2 p-5 ${width}`}
        >
          <div className="hidden md:block">
            <Image
              src={currentUserImg}
              alt="img not found"
              width={50}
              height={50}
              className="w-10 h-auto"
            />
          </div>

          <textarea
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Replying to ${comment.user.username}`}
            maxLength={300}
            className={`min-h-[100px] border-2 border-blue-600 rounded-lg p-2 ${textWidth}`}
            style={{ resize: "none" }}
          />
          <div
            className={`flex md:hidden flex-row justify-between  mt-2 ${width2}`}
          >
            <Image
              src={currentUserImg}
              alt="img not found"
              width={50}
              height={50}
              className="w-10 h-auto"
            />
            <button
              className=" bg-blue-600 rounded-lg w-[90px] h-[40px] text-white transition-colors duration-300 filter  hover:bg-blue-300 "
              onClick={handleSendReply}
            >
              REPLY
            </button>
          </div>
          <button
            className=" hidden md:block bg-blue-600 rounded-lg w-[90px] h-[40px] text-white transition-colors duration-300 filter  hover:bg-blue-300 "
            onClick={handleSendReply}
          >
            REPLY
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;
