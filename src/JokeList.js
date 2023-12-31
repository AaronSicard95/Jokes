import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

//no hooks since it's been well over two weeks and you guys still haven't fixed the page about custom hooks
/** List of jokes. */

function JokeList(props){
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>(async function startJokes(){
    await getJokes();
  }),[])

  const getJokes = async () =>{
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let reqjokes = [];
      let seenJokes = new Set();

      while (reqjokes.length < props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          reqjokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }
      setJokes(reqjokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  const generateNewJokes= ()=> {
    setIsLoading(true);
    getJokes();
  }

  const vote=(id, delta) =>{
    setJokes(newJokes => (
      jokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )));
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
    if (isLoading) {
      return (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      )
    }

    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(j => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={vote}
          />
        ))}
      </div>
    );
}

JokeList.defaultProps={
  numJokesToGet: 5
}

export default JokeList;