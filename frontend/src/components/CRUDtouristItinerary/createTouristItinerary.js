import React, { useState, useEffect } from "react";
import axios from "axios";

const URL = `${process.env.REACT_APP_BACKEND_URL}`;

const CreateTouristItinerary = () => {
  const [activities, setActivities] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(URL + "/activity/");
        setActivities(response.data.filter((activity) => activity.isActive));
        console.log("Activities:", response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get(URL + "/tag");
        setTags(response.data.filter((tag) => tag.isActive));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchActivities();
    fetchTags();
  }, []);

  const handleActivityChange = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity._id)
        ? prev.filter((id) => id !== activity._id)
        : [...prev, activity]
    );
  };

  console.log(selectedActivities);

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.some((t) => t._id === tag._id)
        ? prev.filter((t) => t._id !== tag._id)
        : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < currentDate) {
      setError("Start date must be after the current date.");
      return;
    }

    if (end < start) {
      setError("End date must be after the start date.");
      return;
    }

    const itinerary = {
      activities: selectedActivities.map((activity) => activity._id),
      startDate,
      endDate,
      tags: selectedTags.map((tag) => tag._id),
    };

    axios
      .post(URL + "/touristItenerary/create", itinerary)
      .then((response) => {
        console.log("Itinerary created:", response.data);
      })
      .catch((error) => {
        console.error("There was an error creating the itinerary!", error);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create Tourist Itinerary
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label className="block mb-2 text-lg">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="form-group">
          <label className="block mb-2 text-lg">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="form-group">
          <label className="block mb-2 text-lg">Activities:</label>
          {activities.length === 0 ? (
            <p>No activities available.</p>
          ) : (
            <div className="flex flex-wrap -mx-2">
              {activities.map((activity) => (
                <div
                  key={activity._id}
                  className="activity mb-4 p-4 border rounded shadow-sm hover:shadow-md transition-shadow mx-2 w-1/3"
                >
                  <input
                    type="checkbox"
                    value={activity._id}
                    onChange={() => handleActivityChange(activity)}
                    className="mr-2"
                  />
                  <div className="inline-block">
                    <strong>Name:</strong> {activity?.name}
                    <br />
                    <strong>Date:</strong> {activity?.date}
                    <br />
                    <strong>Time:</strong> {activity?.time}
                    <br />
                    <strong>Location:</strong> {activity?.location}
                    <br />
                    <strong>Price:</strong> ${activity?.price.min} - $
                    {activity?.price.max}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label className="block mb-2 text-lg">Tags:</label>
          {tags.length === 0 ? (
            <p>No tags available.</p>
          ) : (
            <div className="flex flex-wrap -mx-2">
              {tags.map((tag) => (
                <div
                  key={tag?._id}
                  className="tag mb-4 p-4 border rounded shadow-sm hover:shadow-md transition-shadow mx-2 w-1/3"
                >
                  <input
                    type="checkbox"
                    value={tag?._id}
                    onChange={() => handleTagChange(tag)}
                    className="mr-2"
                  />
                  <div className="inline-block">
                    <strong>Name:</strong> {tag?.name}
                    <br />
                    <strong>Type:</strong> {tag?.type}
                    <br />
                    <strong>Historical Period:</strong> {tag?.historicalPeriod}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          onClick={handleSubmit}
        >
          Create Itinerary
        </button>
      </form>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Selected Activities:</h2>
        <div className="flex flex-wrap -mx-2">
          {selectedActivities.map((activity) => {
            console.log(activity);
            // const activity = activities.find((act) => act.id === activityId);

            return (
              <div
                key={activity._id}
                className="selected-activity mb-4 p-4 border rounded shadow-sm mx-2 w-1/3"
              >
                <div className="inline-block">
                  <strong>Name:</strong> {activity?.name}
                  <br />
                  <strong>Date:</strong> {activity?.date}
                  <br />
                  <strong>Time:</strong> {activity?.time}
                  <br />
                  <strong>Location:</strong> {activity?.location}
                  <br />
                  <strong>Price:</strong> ${activity?.price?.min} - $
                  {activity?.price?.max}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Selected Tags:</h2>
        <div className="flex flex-wrap -mx-2">
          {selectedTags.map((tag) => (
            <div
              key={tag._id}
              className="selected-tag mb-4 p-4 border rounded shadow-sm mx-2 w-1/3"
            >
              <div className="inline-block">
                <strong>Name:</strong> {tag.name}
                <br />
                <strong>Type:</strong> {tag.type}
                <br />
                <strong>Historical Period:</strong> {tag.historicalPeriod}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateTouristItinerary;
