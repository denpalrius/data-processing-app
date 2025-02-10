const axios = require("axios");

const testEvent = {
  fileId: "6fc95460-a22b-4bba-bb7e-679a4729f8e4",
  data: [
    {
      0: "1",
      1: "0",
      "-0.33": "-0.33",
      0.69: "0.94",
      1.1: "1",
      0.1: "0",
      0.8: "0.8",
      0.2: "1",
      0.88: "0.31",
      N: "O",
    },
    {
      0: "1",
      1: "0",
      "-0.33": "-0.33",
      0.69: "0.5",
      1.1: "0",
      0.1: "0",
      0.8: "1.0",
      0.2: "-1",
      0.88: "0.5",
      N: "N",
    },
  ],
};

axios
  .post("http://localhost:8081/broadcast", testEvent)
  .then((response) => {
    console.log("Test event sent successfully:", response.data);
  })
  .catch((error) => {
    console.error("Error sending test event:", error.message);
  });
