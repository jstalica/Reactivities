import { Formik } from 'formik'
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import * as Yup from 'yup'
import MyTextAreaInput from '../../app/common/form/MyTextAreaInput';
import MyTextInput from '../../app/common/form/MyTextInput';
import { ProfileFormValues } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props{
    setEditProfileMode: (change:boolean) => void
}

export default observer(function ProfileForm({setEditProfileMode}:Props) {

    const { profileStore, activityStore } = useStore();
    const { profile: Profile, updateProfile } = profileStore;
    const {updateBio} = activityStore;

    const [profile, setProfile] = useState<ProfileFormValues>(new ProfileFormValues());

    const validationSchema = Yup.object({
        displayName: Yup.string().required('The display name is required.')
    })

    useEffect(() => {
        if (Profile) {
            setProfile(new ProfileFormValues(Profile));
        }
    }, [Profile])

    function handleFormSubmit(profile: ProfileFormValues) {
        updateProfile(profile)
            .then(() => {
                setEditProfileMode(false);
                updateBio(Profile);
            })
    }

    return (

        <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={profile}
            onSubmit={values => handleFormSubmit(values)}>
            {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextAreaInput placeholder='' rows={profile.bio?.split('\n').length || 3} name='bio' />
                    <Button
                        disabled={isSubmitting || !dirty || !isValid}
                        loading={isSubmitting}
                        floated='right'
                        positive
                        type='submit'
                        content='Update Profile' />
                </Form>
            )}
        </Formik>
    )
})
