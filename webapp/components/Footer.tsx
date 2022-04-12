import { ActionIcon, Container, createStyles, Group } from '@mantine/core';
import { Link } from '@remix-run/react';
import React, { useState } from 'react';
import { BrandGithub, BrandLastfm, BrandTwitch, BrandTwitter, BrandYoutube } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 20,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },

  
  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
}}));

interface HeaderSimpleProps {
  links: { link: string; label: string }[];
}

export function FooterSocial({ links }: HeaderSimpleProps) {
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link.link })}
      onClick={(event) => {
        setActive(link.link);
      }}
      prefetch={"intent"}
    >
      {link.label}
    </Link>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <h1>mmatt.net</h1>

        <Group spacing={5} className={classes.links}>
            {items}
        </Group>

        <Group spacing={0} className={classes.links} position="right" noWrap>
          <ActionIcon size="lg" component={'a'} href={"https://twitter.com/mmattbtw"}>
            <BrandTwitter size={18} />
          </ActionIcon>
          <ActionIcon size="lg" component={'a'} href={"https://github.com/mmattbtw"}>
            <BrandGithub size={18} />
          </ActionIcon>
          <ActionIcon size="lg" component='a' href={"https://twitch.tv/mmattbtw"}>
            <BrandTwitch size={18} />
          </ActionIcon>
          <ActionIcon size="lg" component='a' href={"https://last.fm/user/mmattbtw"}>
            <BrandLastfm size={18} />
          </ActionIcon>
          <ActionIcon size="lg" component='a' href={"https://youtube.com/mmattbtw"}>
            <BrandYoutube size={18} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
}