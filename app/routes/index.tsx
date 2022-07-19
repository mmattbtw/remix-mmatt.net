import { Button, Collapse, Container, Grid, Image } from '@mantine/core';
import { deferred, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import LastFm from '@toplast/lastfm';
import { useState } from 'react';

interface discogsReturn {
    collectionValue: {
        minimum: string;
        median: string;
        maximum: string;
    } | null;
    collectionData: any;
    lastFmData: any;
}

// I HATE THIS, ITS SLOW AN INEFFICIENT (AT LEAST ON VERCEL) MAYBE EDGE FUNCTION MOMENT? IDK
export async function loader() {
    const lastFm = new LastFm(`${process.env.LASTFM_API_KEY}`);
    const discogsHeaders = {
        Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
    };

    try {
        let [collectionValue, collectionData, lastfmData] = await Promise.all([
            fetch('https://api.discogs.com/users/mmattbtw/collection/value', { headers: discogsHeaders }),
            fetch('https://api.discogs.com/users/mmattbtw/collection/folders/0/releases?sort=added&sort_order=asc', { headers: discogsHeaders }),
            lastFm.user.getTopArtists({ user: 'mmattbtw', limit: 20 }),
        ]);

        let [collectionValueData, collectionDataData] = await Promise.all([collectionValue.json(), collectionData.json()]);

        return deferred({
            collectionValue: collectionValueData,
            collectionData: collectionDataData,
            lastFmData: lastfmData,
        });
    } catch (FetchError) {
        return deferred({
            collectionValue: null,
            collectionData: null,
            lastFmData: null,
        });
    }
}

export const meta: MetaFunction = () => {
    return {
        title: '/home - mmatt.net',
        description: 'mmatt.net/home',
        'twitter:title': '/home - mmatt.net',
        'twitter:description': 'mmatt.net/home',
        'og:title': '/home - mmatt.net',
        'og:description': 'mmatt.net/home',
        'og:url': 'https://mmatt.net/home',
    };
};

export default function Index() {
    const { collectionValue, collectionData, lastFmData }: discogsReturn = useLoaderData();
    const [opened, setOpen] = useState(false);
    const [openedLastFm, setOpenLastFm] = useState(false);

    return (
        <Container>
            <h1>/home</h1>

            <h2>support these links below</h2>
            <ul>
                <li>
                    <a href={'https://blacklivesmatters.carrd.co/'}>black lives matter</a>
                </li>
                <li>
                    <a href={'https://anti-asianviolenceresources.carrd.co/'}>stop aapi hate</a>
                </li>
            </ul>

            <h2>about me</h2>
            <p>
                i sometimes stream video games (and programming) on my <a href="https://twitch.tv/mmattbtw">twitch</a>.
            </p>
            <p>
                my main programming project right now is <a href="https://github.com/mmattDonk/ai-tts-donations">AI TTS Donations</a>
            </p>
            <p>
                you can learn more about my other projects over at{' '}
                <Link to="/projects" prefetch="intent">
                    /projects
                </Link>
            </p>

            <p>
                i enjoy collecting vinyl records, and i enjoy listening to music, in the next section, you will see some of the artists i like to
                listen to!
            </p>

            <h2>music</h2>

            {lastFmData ? (
                <>
                    <h3>my top artists</h3>
                    <p>
                        all gathered from my <a href="https://last.fm/user/mmattbtw">last.fm profile</a>
                    </p>
                    <Button onClick={() => setOpenLastFm((o) => !o)} size="xs" variant="light">
                        show top artists
                    </Button>

                    <Collapse in={openedLastFm}>
                        {lastFmData.topartists.artist.map((artist: any) => {
                            return (
                                <li key={artist.mbid} style={{ listStyleType: 'none' }}>
                                    <p key={artist.mbid}>
                                        <a href={artist.url}>
                                            #{artist['@attr'].rank} {artist.name} ({artist.playcount} plays)
                                        </a>
                                    </p>
                                </li>
                            );
                        })}
                    </Collapse>
                </>
            ) : (
                <p>
                    usually my top artists render here, but it seems like it hasn't so go check out my{' '}
                    <a href="https://last.fm/user/mmattbtw">last.fm profile!</a>
                </p>
            )}

            <p>i like to regularly expand my music taste, so if you have any suggestions, let me know!</p>

            <h3>my playlist</h3>
            <p>
                i mainly used spotify's "liked songs" as my main playlist, but you can't make that public so the playlist below is a regularly updated
                mirror of it, enjoy, or don't :^)
            </p>

            <iframe
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/playlist/078j7sfJjY3CKgsf005R2V?utm_source=generator"
                width="100%"
                height="380"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            ></iframe>

            <h3>required listening</h3>
            <p>these songs are too good to pass up on.</p>

            <ul>
                <li>
                    <a href="https://www.youtube.com/watch?v=ZG6zsHUCum4">lil b - im god</a>{' '}
                    <a href="https://www.youtube.com/watch?v=yTC8ECjQBp8">(the live version goes too)</a>
                </li>
                <li>
                    <a href="https://www.youtube.com/watch?v=WunyRgaA_ws">virtual self- god rays</a> (required watching too, the visuals/lights on
                    this track is insane and i want to see it live one day)
                </li>
                <li>
                    <a href="https://open.spotify.com/track/432hUIl3ISDeytYW5XBQ5h?si=525a126aee36406d">kanye west - wolves</a> (this song made me buy
                    better headphones after listening to this song for the first time on some good headphones)
                </li>
                <li>
                    <a href="https://www.youtube.com/watch?v=DlSIznmujYM">sweet trip - pro: lov: ad</a>
                </li>
                <li>
                    <a href="https://www.youtube.com/watch?v=AC8h4HnWyys">SOPHIE - OIL OF EVERY PEARL'S UN-INSIDES</a> (i know this is an album, but
                    its worth it, listen to it <a href="https://cdn.7tv.app/emote/61e14854950a8915e1708862/4x">NOW</a>)
                </li>
                <li>
                    <a href="https://www.youtube.com/watch?v=FQPXX_eZZAk">magdalena bay - you lose!</a>
                </li>
                <li>
                    <a href="https://www.youtube.com/watch?v=TbJE-KVZvTA">charli xcx - forever</a>
                </li>
                <li>
                    <a href="https://www.youtube.com/playlist?list=PLzoqV_VvWIwGzYTcm3r1JwqgQOBXTvKyd">frank ocean - blonde</a>
                </li>
                <li>
                    <a href="https://www.youtube.com/watch?v=LcSZURoLbis">a$ap rocky - lvl</a>
                </li>
            </ul>

            <h3>my vinyl record collection</h3>
            <p>
                i own quite a bit of vinyl records, and i add things to my collection all the time. so check out my{' '}
                <a href="https://discogs.com/user/mmattbtw">discogs!</a>
                {collectionValue ? (
                    <>
                        <br />
                        according to <a href="https://www.discogs.com/user/mmattbtw">discogs</a> i have a median collection value of{' '}
                        {collectionValue.median}
                    </>
                ) : (
                    ''
                )}
            </p>

            {collectionData ? (
                <>
                    <Button onClick={() => setOpen((o) => !o)} size="xs" variant="light">
                        show collection
                    </Button>

                    <Collapse in={opened}>
                        <a href="https://www.discogs.com/user/mmattbtw/collection?header=1">
                            <h4>view all information here!</h4>
                        </a>
                        <ul>
                            {collectionData.releases.map((release: any) => {
                                return (
                                    <li key={release.basic_information.id} style={{ listStyleType: 'none' }}>
                                        <Grid align="center">
                                            <Grid.Col span={4}>
                                                <Image
                                                    src={release.basic_information.cover_image}
                                                    height={100}
                                                    fit={'contain'}
                                                    alt={`the album cover for ${release.basic_information.title}`}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <p key={release.basic_information.id}>
                                                    {release.basic_information.artists[0].name} - {release.basic_information.title} (
                                                    {release.basic_information.formats[0].name}
                                                    {release.basic_information.formats[0].text
                                                        ? ' - ' + release.basic_information.formats[0].text
                                                        : ''}
                                                    )
                                                </p>
                                            </Grid.Col>
                                        </Grid>
                                    </li>
                                );
                            })}
                        </ul>
                    </Collapse>
                </>
            ) : (
                ''
            )}

            <h2>socials</h2>
            <p>
                all of my socials are available on <a href="https://mm.omg.lol">mm.omg.lol</a>. i don't list them all here because they aren't always
                going to be up to date, and my omg.lol page is much easier to just link everywhere and update, and it updates accross all platforms.
            </p>

            <h2>contact</h2>
            <p>
                formal contact can be done over <a href="https://mmatt.link/email">email</a>
            </p>
            <p>
                other contact can be done through <a href="https://discord.com/users/308000668181069824">discord</a> or{' '}
                <a href="https://twitter.com/mmattbtw">twitter</a>
            </p>

            <h2>support me</h2>
            <p>if you ever feel giving me massive amounts of money</p>
            <ul>
                <p>direct ways:</p>
                <li>
                    <a href="https://github.com/sponsors/mmattbtw">github sponsors</a>
                </li>
                <li>
                    <a href="https://ko-fi.com/mmatt">ko-fi</a>
                </li>
                <li>
                    <a href="https://patreon.com/mmattdonk">patreon subscription</a>
                </li>
                <li>
                    <a href="https://twitch.tv/mmattbtw/subscribe">twitch subscription</a>
                </li>
                <hr />
                <p>referal codes:</p>
                <li>
                    <a href="https://privacy.com/join/9X6CP">privacy.com - get $10 in privacy.com credit to use on anything</a>
                </li>
                <li>
                    <a href="https://www.digitalocean.com/?refcode=3470e3b80f7c&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge">
                        digitalocean - get $100 in digitalocean credit to use on digitalocean servers
                    </a>
                </li>
                <li>
                    <a href="https://www.epicgames.com/store/p/fortnite?epic_creator_id=0caf473a446a4837a448dce55f063ebc&epic_game_id=fortnite">
                        epic games store (use code matt) - you can also use code matt in the fortnite item shop #EpicPartner
                    </a>
                </li>
                <li>
                    <a href="https://cash.app/app/WHRZRCK">cash app - get $5 cash app balance on signup</a>
                </li>
            </ul>
            <p style={{ fontStyle: 'italic' }}>
                All links above are affiliate links that help benefit me, I either get a kickback, or some other perks.
            </p>

            <h2>info about this site</h2>
            <p>
                this site was made using the wonderful <a href="https://remix.run">remix.js</a> and <a href="https://mantine.dev/">mantine</a>. it's
                hosted on vercel, and is open sourced here: <a href="https://github.com/mmattbtw/remix-mmatt.net">mmattbtw/remix-mmatt.net</a>.
            </p>

            <h3>what's the deal with the scribbles?</h3>
            <p>
                if you took a look at my top artists, you can see that one of my top artists is porter robinson. one of his new aesthetic things with
                his new album 'nurture' are these cool scribbles that i think look nice. anyways i pretty much just stole the idea and worked it into
                my website. sorry nature boy but mr. mmattbtw has stolen your funny little scribbles for his website
            </p>
        </Container>
    );
}
