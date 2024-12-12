const fun = async () => {
  const data = await fetch("http://localhost:8020/runCode", {
    headers: {
      accept: "application/json, text/plain, */*",
      authorization: "106068292256063451762",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      Referer: "http://localhost:5173/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `{"language":"javascript","code":"// Write your JavaScript code here\\n\\n\\nconsole.log(\\"wow ${Math.floor(Math.random()*100)}\\");"}`,
    method: "POST",
  });

  const res = await data.json();
  console.log(res);
};

setInterval(async () => {
  await fun();
}, 100);
