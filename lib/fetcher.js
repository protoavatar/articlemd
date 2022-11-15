// import { logger, formatObjectKeys } from "../utils/logger";

// const fetcher = async (url, token) => {
const fetcher = async (url, params) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: new Headers({
        'Authorization': process.env.NEXT_PUBLIC_TOKEN,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(params),
    })
    if (res.ok) {
      return res.json();
    } else {
      // logger.error(
      //     {
      //         message: {
      //             response: res,
      //         },
      //         code: "Fetcher",
      //     },
      //     "Received no valid answer from API"
      // );
      throw {
        code: "Fetcher",
        message: "Received no valid answer from API",
      };

      // throw new Error("Problem with API Call");
    }
  } catch (error) {
    // logger.error(
    //     {
    //         message: {
    //             request: {
    //                 url: url,
    //                 params: params,
    //             },
    //         },
    //         error,
    //     },
    //     error.message
    // );
    throw {
      code: "Fetcher",
      message: "Error detected. Please contact webmaster",
    };
  }
};

export default fetcher;

