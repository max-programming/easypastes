import { NextApiRequest, NextApiResponse } from "next";
import { PasteType } from "types";
import supabaseClient from "utils/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Allow only POST requests
  if (req.method !== "POST") {
    res.status(400).send({ message: "Only POST requests allowed." });
    return;
  }

  // Get the records from body
  const { code, language, title, userId, _public, _private } = req.body;

  // Add them to supabase
  const { data, error } = await supabaseClient
    .from<PasteType>("Pastes")
    .insert([
      { code, language, title, userId, public: _public, private: _private },
    ]);

  // Debugging
  console.log(data);
  console.log(error);

  // Send back the responses.
  res.status(200).json({ data, error });
};

export default handler;
