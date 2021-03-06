import { Avatar, Button, Container, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { ActionArgs, json, LoaderArgs, MetaFunction, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { marked } from 'marked';
import Comment from '~/components/Comment';
import PrettyDate from '~/components/DateFunction';
import { ProjectHeader } from '~/components/ProjectHeader';
import { authenticator } from '~/services/auth.server';
import { comments, createComment, getCommentsViaParentId } from '~/services/comments.server';
import { getProjectViaSlug, projects } from '~/services/projects.server';

type loaderData = {
    project: projects;
    session: any | null;
    comments: comments[];
};

export async function loader({ params, request }: LoaderArgs) {
    let [project, session] = await Promise.all([getProjectViaSlug(params.slug || ''), authenticator.isAuthenticated(request)]);

    const comments = await getCommentsViaParentId(project?.id || '');

    if (!session) {
        session = null;
    }

    return json({ project, session, comments }) as unknown as loaderData;
}

export async function action({ request, params }: ActionArgs) {
    const session = await authenticator.isAuthenticated(request);
    if (!session) {
        return redirect('/login');
    }

    const formData = await request.formData();

    const content = formData.get('comment') as string;
    if (content === '' || content === null) {
        return redirect('/projects/' + params.slug);
    }

    const parentPost = await getProjectViaSlug(params.slug || '');
    const parentPostId = parentPost?.id || '';
    const userId = session.json.id || '';

    const commentData = {
        parentPostId,
        userId,
        content,
    };

    await createComment(commentData);

    return null;
}

export const meta: MetaFunction = ({ data, params }) => {
    if (!data) {
        return {
            title: 'Unknown Project - mmatt.net',
            description: `There is no project with the slug of ${params.slug}.`,
        };
    }

    const { project } = data as loaderData;
    return {
        description: `${project.title} - ${PrettyDate(project.CreatedAt)}`,
        title: `${project.title} - mmatt.net`,
        'twitter:title': `${project.title} - mmatt.net`,
        'twitter:image': project.imageUrl,
        'twitter:description': `${project.title} - ${PrettyDate(project.CreatedAt)}`,

        'og:image': project.imageUrl,
        'og:title': `${project.title} - mmatt.net`,
        'og:description': `${project.title} - ${PrettyDate(project.CreatedAt)}`,
        'og:url': `https://mmatt.net/projects/${params.slug}`,
    };
};

export default function ProjectPage() {
    const { project, session, comments } = useLoaderData<typeof loader>();

    const html = marked(project?.markdown.trim() ?? '');

    if (!project) {
        return (
            <Container>
                <h1>Unknown Project</h1>
            </Container>
        );
    }

    return (
        <Container>
            <ProjectHeader {...project} />

            {session?.json.id === '640348450' ? (
                <h5>
                    id: {project?.id} |{' '}
                    <Link to={'/projects/admin/edit/' + project.id} prefetch="intent">
                        edit project
                    </Link>
                </h5>
            ) : (
                ''
            )}

            <hr />

            <div dangerouslySetInnerHTML={{ __html: html }} />

            <hr />

            <h4>{comments.length} Comments</h4>

            {session ? (
                <Form method="post" reloadDocument>
                    <p>
                        <label>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Avatar
                                    radius={'xl'}
                                    style={{ marginRight: '1rem' }}
                                    alt={session?.json.display_name + "'s profile image."}
                                    src={session?.json.profile_image_url}
                                />
                                <Textarea name="comment" id="comment" placeholder="Leave a comment..." cols={100} autosize />
                            </div>
                        </label>
                    </p>
                    <p>
                        <Button
                            type="submit"
                            size="xs"
                            onClick={() => {
                                showNotification({
                                    title: 'Commenting...',
                                    message: 'Your comment is being posted.',
                                    loading: true,
                                });
                            }}
                        >
                            Comment
                        </Button>
                    </p>
                </Form>
            ) : (
                <>
                    {' '}
                    <Link to="/login" prefetch="intent">
                        You must be logged in to comment.
                    </Link>{' '}
                    <br />{' '}
                </>
            )}

            {comments.length >= 1 ? (
                comments.map((comment) => (
                    <>
                        <br />
                        <Comment key={comment.id} {...comment} />
                    </>
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </Container>
    );
}
