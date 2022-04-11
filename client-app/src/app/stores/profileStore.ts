import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile, ProfileFormValues } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings: boolean = false;
    activeTab: string | number | undefined = undefined;

    constructor() {
        makeAutoObservable(this);

        reaction(() => this.activeTab, activeTab => {
            if (activeTab && (activeTab === 3 || activeTab === 4)) {
                const predicate = activeTab === 3 ? 'followers' : 'following'
                this.loadFollowings(predicate)
            } else {
                this.followings = [];
            }
        })
    }

    setActiveTab = (activeTab: string | number | undefined) => {
        this.activeTab = activeTab;
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            // TODO: Skip loading if profile is current users
            if (this.profile?.username !== username) {
                const profile = await agent.Profiles.get(username);
                runInAction(() => {
                    this.profile = profile
                })
            }
            runInAction(() => this.loadingProfile = false);

        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error)
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
                store.activityStore.updateMainPhoto(photo);
                this.loading = false;
            })

        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }

    deletePhoto = async (id: string) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(id);

            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(p => p.id !== id);
                }
                this.loading = false;
            })
        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }

    updateProfile = async (profile: ProfileFormValues) => {
        this.loading = true;
        try {
            await agent.Profiles.update(profile);

            runInAction(() => {
                if (this.profile) {
                    this.profile.bio = profile.bio;
                    this.profile.displayName = profile.displayName;
                }
                this.loading = false;
            })
        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                if(this.profile && this.profile.username === store.userStore.user?.username) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following
                    }
                })
                this.loading = false;
            })

        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            })

        } catch (error) {
            runInAction(() => this.loadingFollowings = false);
            console.log(error);
        }
    }
}