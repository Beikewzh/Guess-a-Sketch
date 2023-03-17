import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "service/socket";

import {
    Button,
    Header,
    Container,
    ErrorMessage,
    Form,
    FormInput,
} from "components";
import { CreateRoomPage } from "pages";

function Home() {
    const [roomId, setRoomId] = useState("");
    const [nickname, setNickname] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState("");

    const navigate = useNavigate();

    const createRoomButtonRef = useRef();
    const [showCreateRoomPage, setShowCreateRoomPage] = useState(false);

    const handleJoinRoom = (e) => {
        e.preventDefault();
        localStorage.setItem("nickname", nickname);
        socket.room = roomId;

        if (roomId === "") {
            setShowErrorMessage("Room code cannot be empty");
        } else {
            socket.emit("join-room", roomId);
            socket.on("join-room-fail", (data) => {
                setShowErrorMessage(data.msg);
            });
            socket.on("join-room-success", (roomId) => {
                navigate(`/room/${roomId}`);
            });
        }
    };

    useEffect(() => {
        const button = createRoomButtonRef.current;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            setShowCreateRoomPage(true);
        });
    }, []);

    return showCreateRoomPage ? (
        <CreateRoomPage />
    ) : (
        <>
            <Header />
            <Container>
                <Form className="flex-form" onSubmit={handleJoinRoom}>
                    {showErrorMessage && (
                        <ErrorMessage>{showErrorMessage}</ErrorMessage>
                    )}
                    {/* {roomId === "" && (
                        <ErrorMessage>Please enter room code</ErrorMessage>
                    )} */}
                    <FormInput
                        label="Join a room"
                        placeholder="Enter room code"
                        type="text"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                    ></FormInput>
                    <FormInput
                        label="Nickname"
                        placeholder="Enter nickname"
                        type="text"
                        onChange={(e) => setNickname(e.target.value)}
                        value={nickname}
                    ></FormInput>
                    <Button column type="submit">
                        Join
                    </Button>
                    <Button column ref={createRoomButtonRef} secondary>
                        Create a new room
                    </Button>
                </Form>
            </Container>
        </>
    );
}

export default Home;