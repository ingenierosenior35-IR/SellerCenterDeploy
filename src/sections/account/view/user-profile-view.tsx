'use client';

import Card from "@mui/material/Card";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs/custom-breadcrumbs";
import { HomeContent } from "src/layouts/home";
import { ProfileCover } from "../components/profile-cover";
import Box from '@mui/material/Box';
import { Iconify } from "src/components/iconify";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { RouterLink } from 'src/routes/components';
import { usePathname, useSearchParams } from 'src/routes/hooks';
import { useAuthContext } from "src/auth/hooks";
import { paths } from "src/routes/paths";
import { ProfileHome } from "../components/profile-home";

const TAB_PARAM = 'tab';
//---- Define the navigation items for the user profile tabs
const NAV_ITEMS = [
    { value: '', label: 'Perfil', icon: <Iconify width={24} icon="solar:user-id-bold" /> },
    {
        value: 'configuration',
        label: 'Configuración',
        icon: <Iconify width={24} icon="solar:settings-bold" />,
    },
    {
        value: 'documents',
        label: 'Documentos',
        icon: <Iconify width={24} icon="solar:document-add-bold" />,
    },
];
//---- Define the navigation items for the user profile tabs

export function UserProfileView() {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedTab: string = searchParams.get(TAB_PARAM) ?? '';

    const { user } = useAuthContext();

    const firstName = (user?.firstName ?? user?.firstname ?? '').trim();
    const lastName = (user?.lastName ?? user?.lastname ?? '').trim();

    const displayName =
        user?.displayName ||
        [firstName, lastName].filter(Boolean).join(' ') ||
        user?.email ||
        'Usuario';


    const createRedirectPath = (currentPath: string, query: string): string => {
        const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
        return query ? `${currentPath}?${queryString}` : currentPath;
    };

    return (
        <HomeContent>
            <CustomBreadcrumbs
                heading="Perfil"
                links={[
                { name: 'Inicio', href: paths.home.root },
                { name: 'Cuenta', href: paths.account?.root ?? paths.home.root },
                { name: displayName },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            
            <Card sx={{ height: 290, position: 'relative' }}>
                <ProfileCover
                role="role"
                name={displayName}
                avatarUrl={undefined}
                coverUrl="coverUrl"
                />

                <Box
                sx={{
                    width: 1,
                    bottom: 0,
                    zIndex: 9,
                    px: { md: 3 },
                    display: 'flex',
                    position: 'absolute',
                    bgcolor: 'background.paper',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                }}
                >
                <Tabs value={selectedTab}>
                    {NAV_ITEMS.map((tab) => (
                    <Tab
                        component={RouterLink}
                        key={tab.value}
                        value={tab.value}
                        icon={tab.icon}
                        label={tab.label}
                        href={createRedirectPath(pathname, tab.value)}
                    />
                    ))}
                </Tabs>
                </Box>
            </Card>

            {selectedTab === '' && <ProfileHome sx={{ mt: 3 }} />}

        </HomeContent>
    );
}