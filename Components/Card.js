"use client";
import React from "react";

const dummyUsers = [
  {
    id: 1,
    name: "Sara Khan",
    location: "Karachi",
    occupation: "Graphic Designer",
    photo: "/cover.jpg", 
  },
  {
    id: 2,
    name: "Ali Raza",
    location: "Lahore",
    occupation: "Software Engineer",
    photo: "/cover.jpg", 
  },
  {
    id: 3,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 4,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 5,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 6,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 7,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 8,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 9,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 10,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 11,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 12,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 13,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 14,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 15,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 16,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 17,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 18,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 19,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 20,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
  {
    id: 21,
    name: "Maya Ali",
    location: "Islamabad",
    occupation: "Marketing Specialist",
    photo: "/cover.jpg", 
  },
];

export default function UserCardsSection({ users = dummyUsers }) {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-16 py-10">
      <h2 className="text-3xl font-semibold mb-8 text-gray-900 ">
        Discover Profiles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {users.map(({ id, name, location, occupation, photo }) => (
          <div
            key={id}
            className="bg-[#F8FAFC] rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="relative h-64 w-full">
              <img
                src={photo}
                alt={name}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium text-[#0F172A]  mb-1">
                {name}
              </h3>
              <p className="text-gray-600  mb-1">{location}</p>
              <p className="text-indigo-600  font-semibold">
                {occupation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
