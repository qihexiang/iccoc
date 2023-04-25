import { useUser } from "@/lib/useUser";
import { Box, Card, CardContent, Modal, Typography } from "@mui/material";

export default function ActivitesIndex() {
    useUser({ redirectTo: "/activities/login", redirectOnLoggedIn: false });
    useUser({ redirectTo: "/activities/panel", redirectOnLoggedIn: true });
    return <Modal open={true}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
            <Card>
                <CardContent>
                    <Typography variant="h6">Loading</Typography>
                    <Typography variant="body1">Please wait...</Typography>
                </CardContent>
            </Card>
        </Box>
    </Modal>
}