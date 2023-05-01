import fetch from 'node-fetch';

export async function getPosts() {
  const response = await fetch('http://localhost:3000/posts');
  const data = await response.json();
  return data;
}

export async function getPost(_, { id }) {
  const response = await fetch(`http://localhost:3000/posts/${id}`);
  const data = await response.json();
  return data;
}

export async function getPostAuthor(parent) {
  const response = await fetch(`http://localhost:3000/users/${parent.userId}`);
  const data = await response.json();
  return data;
}

