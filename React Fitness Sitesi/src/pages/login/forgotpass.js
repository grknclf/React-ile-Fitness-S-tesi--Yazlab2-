import { getAuth, sendPasswordResetEmail } from "@firebase/auth";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import Button from '@mui/material/Button';
import { useState } from "react";

export function ForgotScreen() {

	const auth = getAuth();
	const [mail, setmail] = useState("");
	const [content, setContent] = useState("Sıfırlamak istediğiniz maili giriniz.");
	const handleMailChange = (event) => { setmail(event.target.value) }

	const buttonClick = () => {
		sendPasswordResetEmail(auth, mail)
			.then(() => {
				setContent("Mail Gönderilmiştir! Mailinizden şifrenizi sıfırlayabilirsiniz.")
			})
			.catch((error) => {
				setContent("Bir sorun oluştu!")
			})
	}


	return <Box
		display="flex"
		justifyContent="center"
		alignItems="center"
		flexDirection="column"
		height="100vh">
		<TextField
			sx={{ width: "30%" }}
			value={mail}
			onChange={handleMailChange}>
		</TextField>
		<p>{content}</p>
		<Button
		variant="contained"
		onClick = {buttonClick}
		>Sıfırla</Button>
	</Box>
}


