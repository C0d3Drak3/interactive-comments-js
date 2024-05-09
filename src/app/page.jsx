"use client";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "./components/useLocalStorage";
import Comments from "./components/comments";

export default function Home() {
  const { getItem, setItem } = useLocalStorage("myData");
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  //Función para cambiar las fechas del data.json a un formato legible por la función en comments
  const updateTimestamps = (data) => {
    // Iterating over comments
    data.comments.forEach((comment) => {
      // Update createdAt value
      comment.createdAt = 1713798367793;
      // Iterating over replies
      comment.replies.forEach((reply) => {
        // Update createdAt value in replies
        reply.createdAt = 1713975567793;
      });
    });
  };

  useEffect(() => {
    // Verifying if data already exists in localStorage
    const existingData = getItem();

    if (!existingData) {
      // If data doesn't exist in localStorage, load it from JSON
      fetch("/data.json") // JSON file path
        .then((response) => response.json())
        .then((data) => {
          // Adding "votes" property to currentUser with initial value of an empty object
          data.currentUser.votes = [];
          // Change createdAt property
          updateTimestamps(data);
          // Storing data in localStorage
          setItem(data);
          console.log("Data loaded correctly");
          setCommentsLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching or storing data:", error);
        });
    } else {
      setCommentsLoaded(true); // Set as loaded if data is already in localStorage
      console.log("Data already in localStore:");
    }
  }, [getItem, setItem]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-100">
      {commentsLoaded ? (
        <div className="flex w-full items-center justify-center place-items-center">
          <Comments />
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {/*Footer*/}
      <div className="mt-auto mb-4 text-[11px] md:text-[16px] w-[290px] md:w-[430px] place-self-center text-black ">
        Challenge by{" "}
        <a
          href="https://www.frontendmentor.io?ref=challenge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Frontend Mentor
        </a>
        . Coded by{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Martín Otero
        </a>
        .
      </div>
    </div>
  );
}
