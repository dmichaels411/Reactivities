import { Button, Container, Grid, Header, Tab } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";

export default observer(function ProfileAbout() {
    const { profileStore: { isCurrentUser, updateProfile, profile } } = useStore();
    const [editProfileMode, setEditProfileMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={profile?.displayName} />
                    {isCurrentUser && (
                        <Button floated='right' basic
                            content={editProfileMode ? 'Cancel' : 'Edit Profile'}
                            onClick={() => setEditProfileMode(!editProfileMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {!editProfileMode ?
                        <Container>
                            <p>{profile?.bio}</p>
                        </Container>
                        : <Formik
                            validationSchema={Yup.object({
                                displayName: Yup.string().required('Name is required')
                            })}
                            enableReinitialize
                            initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
                            onSubmit={values => updateProfile(values).then(() => setEditProfileMode(false))}>
                            {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                    <MyTextInput name='displayName' placeholder='Name' />
                                    <MyTextArea rows={3} placeholder='Bio' name='bio' />
                                    <Button
                                        disabled={isSubmitting || !dirty || !isValid}
                                        loading={isSubmitting} floated='right'
                                        positive type='submit' content='Update Profile' />
                                </Form>
                            )}
                        </Formik>
                    }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})