import fetch from 'node-fetch';

export async function getUsers() {
  const response = await fetch('http://localhost:3000/users');
  const data = await response.json();
  return data;
}

export async function getUser(_, { id }) {
  const response = await fetch(`http://localhost:3000/users/${id}`);
  const data = await response.json();
  return data;
}

export async function getUserPosts(parent) {
  const response = await fetch(`http://localhost:3000/posts?userId=${parent.id}`);
  const data = await response.json();
  return data;
}

