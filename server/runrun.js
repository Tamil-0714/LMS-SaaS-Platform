const groups = [
  {
    chatroom_id: "c01f14eaa5f23df0",
    course_id: "0afc64d55106a723",
    chatRoom_name: "ML-Starters",
    create_at: "2025-01-16T13:07:05.000Z",
    unread: true,
    timestamp: false,
  },
];

const newGrp = groups.map((group) => {
  return { ...group, unread: false };
});

console.log(newGrp);
