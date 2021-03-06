import { Button, ColorScheme, ColorSchemeProvider, Global, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import type { MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FooterSocial } from '~/components/Footer';
import HeaderSimple from '~/components/Header';
import { RoomProvider } from '~/liveblocks.config';

function toggleScribbles() {
    var x = document.getElementById('canvas');
    if (x) {
        if (x.style.display === 'none') {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    } else {
        return;
    }
}

export const meta: MetaFunction = () => ({
    charset: 'utf-8',
    title: 'mmatt.net',
    viewport: 'width=device-width,initial-scale=1',
    'og:title': 'mmatt.net',
    'og:type': 'website',
    'og:url': 'https://mmatt.net',
    'og:image': 'https://mmatt.net/assets/images/mmattDonk.png',

    'twitter:creator': '@mmattbtw',
    'twitter:image': 'https://mmatt.net/assets/images/mmattDonk.png',
    'twitter:site': '@mmattbtw',
    'twitter:card': 'summary',
});

const links = [
    { label: '/home', link: '/' },
    { label: '/blog', link: '/blog' },
    { label: '/projects', link: '/projects' },
    { label: '/devices', link: '/devices' },
];

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                {/* Twitch Chat name color for the 'theme color' (shows on Discord embed only.) */}
                <meta name="theme-color" content="#F7BEFF" media="not screen" />
                <Links />
            </head>
            <body>
                <RoomProvider
                    id="mmatt-net"
                    initialPresence={{
                        cursor: null,
                    }}
                >
                    <MantineTheme>
                        {}
                        <NotificationsProvider>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    type: 'tween',
                                    delay: 0.1,
                                }}
                            >
                                <HeaderSimple links={links} />
                                <Outlet />
                                <FooterSocial links={links} />
                            </motion.div>
                            <canvas
                                id="canvas"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'absolute',
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    zIndex: -9999,
                                }}
                            ></canvas>

                            <script src="/bg.js"></script>

                            <Button
                                onClick={() => toggleScribbles()}
                                style={{
                                    position: 'fixed',
                                    bottom: 0,
                                    right: 0,
                                    marginRight: '10px',
                                    marginBottom: '10px',
                                    opacity: 0.75,
                                }}
                                size="xs"
                                variant="outline"
                            >
                                Toggle Scribbles
                            </Button>
                        </NotificationsProvider>
                    </MantineTheme>

                    <ScrollRestoration />
                    <Scripts />
                    <LiveReload />
                </RoomProvider>
            </body>
        </html>
    );
}

function MantineTheme({ children }: { children: React.ReactNode }) {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
    const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
                <Global
                    styles={(theme) => ({
                        a: {
                            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
                            textDecoration: 'underline',

                            '&:hover': {
                                backgroundColor:
                                    theme.colorScheme === 'dark'
                                        ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
                                        : theme.colors[theme.primaryColor][0],
                                color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
                                textDecoration: 'none',
                                border: 'none',
                            },
                        },
                    })}
                />
                {children}
            </MantineProvider>
        </ColorSchemeProvider>
    );
}
