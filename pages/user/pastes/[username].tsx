import {
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import {
  HiOutlineViewList,
  HiOutlineEye,
  HiOutlineLockClosed,
  HiOutlineLink,
} from "react-icons/hi";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { PasteType, User } from "types";
import Paste from "components/CodePastes/Paste";
import supabaseClient from "utils/supabase";
import { SignedOut, WithUser } from "@clerk/clerk-react";
import axios from "axios";

const links = [
  {
    url: "/",
    text: "Home",
  },
  {
    url: "/pastes",
    text: "Pastes",
  },
];

export const getServerSideProps: GetServerSideProps = async context => {
  const { data: users } = await axios.get<Array<User>>(
    "https://api.clerk.dev/v1/users",
    {
      headers: { Authorization: `Bearer ${process.env.CLERK_API_KEY}` },
    }
  );
  const currentUser = users.find(
    user => user.username === context.params?.username
  );
  if (!currentUser) {
    return {
      notFound: true,
    };
  }
  const { data: pastes, error } = await supabaseClient
    .from<PasteType>("Pastes")
    .select("*")
    // @ts-ignore
    .eq("userId", currentUser.id)
    .order("createdAt", { ascending: false });
  return {
    props: {
      pastes,
      username: context.params?.username,
    },
  };
};

export default function MyPastes({
  pastes,
  username,
}: {
  pastes: PasteType[];
  username: string;
}) {
  return (
    <Layout title={`${username} - Pastes`} links={links}>
      <Container maxW="container.xl" mt="6">
        <Heading textAlign="center" size="lg">
          Pastes by {username}
        </Heading>
        <WithUser>
          {user =>
            user.username === username ? (
              <Tabs colorScheme="purple" mt="6">
                <TabList>
                  <Tab>
                    <HiOutlineViewList /> &nbsp; All
                  </Tab>
                  <Tab>
                    <HiOutlineEye /> &nbsp; Public
                  </Tab>
                  <Tab>
                    <HiOutlineLockClosed /> &nbsp; Private
                  </Tab>
                  <Tab>
                    <HiOutlineLink /> &nbsp; Unlisted
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {pastes.map(paste => (
                      <Paste paste={paste} key={paste.id} />
                    ))}
                  </TabPanel>
                  <TabPanel>
                    {pastes
                      .filter(p => p.public)
                      .map(paste => (
                        <Paste paste={paste} key={paste.id} />
                      ))}
                  </TabPanel>
                  <TabPanel>
                    {pastes
                      .filter(p => p.private)
                      .map(paste => (
                        <Paste paste={paste} key={paste.id} />
                      ))}
                  </TabPanel>
                  <TabPanel>
                    {pastes
                      .filter(p => !p.private && !p.public)
                      .map(paste => (
                        <Paste paste={paste} key={paste.id} />
                      ))}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              pastes
                .filter(p => p.public)
                .map(paste => <Paste paste={paste} key={paste.id} />)
            )
          }
        </WithUser>
        <SignedOut>
          {pastes
            .filter(p => p.public)
            .map(paste => (
              <Paste paste={paste} key={paste.id} />
            ))}
        </SignedOut>
      </Container>
    </Layout>
  );
}
