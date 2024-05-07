"use client";
import React, { useState, useEffect } from "react";
import Comment from "./comment";
import NewComment from "./newComment";
import { useLocalStorage } from "./useLocalStorage";

const Comments = () => {
  const { getItem, setItem } = useLocalStorage("myData");
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const data = getItem();
    if (data) {
      setCurrentUser(data.currentUser);
      const sortedComments = data.comments.sort((a, b) => b.score - a.score);
      setComments(sortedComments);
    }
  }, []);

  const handleAddComment = (newCommentPost) => {
    // Copia el array de comentarios actual para evitar mutar el estado directamente
    const updatedComments = [...comments, newCommentPost];

    // Actualiza el estado de los comentarios
    setComments(updatedComments);

    // Guarda los cambios en el localStorage
    setItem({ ...getItem(), comments: updatedComments });
  };

  const handleVoteComment = (commentId, voteType) => {
    // Verifica si el usuario actual ha votado por el comentario principal
    const currentUserVotes = currentUser.votes || [];
    const existingVote = currentUserVotes.find(
      (vote) => vote.commentId === commentId
    );

    // Función para actualizar los votos en el comentario principal y sus respuestas
    const updateVotes = (comments) => {
      return comments.map((comment) => {
        // Verifica si el comentario actual es el comentario principal
        if (comment.id === commentId) {
          // Determina el incremento o decremento del puntaje del comentario
          let scoreChange = 0;
          if (!existingVote) {
            // Si el usuario no ha votado antes por este comentario, aplicar +1 o -1
            scoreChange = voteType === "up" ? 1 : -1;
          } else if (existingVote.voted !== voteType) {
            // Si el usuario cambia su voto, aplicar +2 o -2
            scoreChange = voteType === "up" ? 2 : -2;
          }
          // Actualiza el voto del comentario principal
          const updatedComment = {
            ...comment,
            score: comment.score + scoreChange,
          };
          return updatedComment;
        }
        // Verifica si el comentario actual tiene respuestas
        if (comment.replies && comment.replies.length > 0) {
          // Actualiza el voto en las respuestas correspondientes
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === commentId) {
              // Actualiza el voto de la respuesta
              let scoreChange = 0;
              if (!existingVote) {
                // Si el usuario no ha votado antes por este comentario, aplicar +1 o -1
                scoreChange = voteType === "up" ? 1 : -1;
              } else if (existingVote.voted !== voteType) {
                // Si el usuario cambia su voto, aplicar +2 o -2
                scoreChange = voteType === "up" ? 2 : -2;
              }
              return {
                ...reply,
                score: reply.score + scoreChange,
              };
            }
            return reply;
          });
          // Devuelve el comentario actualizado con las respuestas actualizadas
          return {
            ...comment,
            replies: updatedReplies,
          };
        }
        // Devuelve el comentario sin cambios si no es el comentario principal ni tiene respuestas
        return comment;
      });
    };

    // Actualizar los votos en los comentarios y respuestas
    const updatedComments = updateVotes(comments);

    // Actualizar el voto del usuario en el array de votos del currentUser
    let updatedUserVotes;
    if (!existingVote) {
      updatedUserVotes = [...currentUserVotes, { commentId, voted: voteType }];
    } else {
      // Si el usuario ya ha votado, actualizar su voto
      updatedUserVotes = currentUserVotes.map((vote) =>
        vote.commentId === commentId ? { ...vote, voted: voteType } : vote
      );
    }

    // Actualizar el estado de los comentarios y el currentUser
    setComments(updatedComments);
    setCurrentUser({ ...currentUser, votes: updatedUserVotes });

    // Guardar los cambios en el localStorage
    setItem({
      ...getItem(),
      comments: updatedComments,
      currentUser: { ...currentUser, votes: updatedUserVotes },
    });
  };

  const handleEditComment = (commentId, editedContent) => {
    // Buscar el comentario en el array de comentarios
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        // Si se encuentra el comentario, actualizar su contenido
        return {
          ...comment,
          content: editedContent,
        };
      } else if (comment.replies) {
        // Si el comentario tiene respuestas, buscar en ellas
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === commentId) {
            // Si se encuentra el comentario dentro de las respuestas, actualizar su contenido
            return {
              ...reply,
              content: editedContent,
            };
          }
          return reply;
        });
        // Devolver el comentario actualizado con las respuestas actualizadas
        return {
          ...comment,
          replies: updatedReplies,
        };
      }
      return comment;
    });

    // Actualizar el estado de los comentarios con los comentarios actualizados
    setComments(updatedComments);

    // Guardar los comentarios actualizados en el localStorage
    setItem({
      ...getItem(),
      comments: updatedComments,
    });
  };

  const handleDeleteComment = (commentId) => {
    // Busca el comentario a borrar
    const updatedComments = comments
      .map((comment) => {
        if (comment.id === commentId) {
          // Si la id del comentario es igual a la ID provista, regresa null y lo marca para borrar
          return null;
        } else if (comment.replies) {
          // Busco si tiene un array de replies y si alguno de estos tiene el ID correspondiente
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === commentId) {
              // Si la id del comentario es igual a la ID provista, regresa null y lo marca para borrar
              return null;
            }
            return reply;
          });
          // Regresa el commentario con las respuestas actualizadas
          return {
            ...comment,
            replies: updatedReplies.filter((reply) => reply !== null),
          };
        }
        return comment;
      })
      .filter((comment) => comment !== null); // Remueve el comentario marcado

    // Actualiza el estado de comments y lo guarda en localStorage
    setComments(updatedComments);
    setItem({ currentUser, comments: updatedComments });
  };

  const handleSendReply = (parentCommentId, newReply) => {
    // Encuentra el comentario principal (parent)
    console.log("Handle Send Reply to:" + parentCommentId);
    const parentComment = comments.find(
      (comment) => comment.id === parentCommentId
    );
    if (parentComment) {
      // Agrega la nueva reply al comentario principal (parent)
      const updatedParentComment = {
        ...parentComment,
        replies: [...(parentComment.replies || []), newReply],
      };
      // Actualiza el array de comments
      const updatedComments = comments.map((comment) =>
        comment.id === parentCommentId ? updatedParentComment : comment
      );
      setComments(updatedComments);
      // Guarda la actualización en localStorage
      setItem({ ...getItem(), comments: updatedComments });
    }
  };

  return (
    <div className="flex flex-col w-[350px] md:w-[750px] place-items-center">
      {comments.map((comment) => (
        <div className="">
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            parentCommentId={comment.id}
            onSendReply={handleSendReply}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            onVoteComment={handleVoteComment}
          />
          {comment.replies.length > 0 ? (
            <div className="flex  flex-col ">
              {comment.replies.map((reply) => (
                <div className="flex flex-row justify-between">
                  <div className="flex w-[30px] md:w-[90px] justify-start md:justify-center">
                    <div className=" bg-slate-300 w-1 "></div>
                  </div>

                  <div className="w-[320px] md:w-[650px]">
                    <Comment
                      key={reply.id}
                      comment={reply}
                      currentUser={currentUser}
                      parentCommentId={comment.id}
                      onSendReply={handleSendReply}
                      onEditComment={handleEditComment}
                      onDeleteComment={handleDeleteComment}
                      onVoteComment={handleVoteComment}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
      <NewComment currentUser={currentUser} onAddComment={handleAddComment} />
    </div>
  );
};

export default Comments;
