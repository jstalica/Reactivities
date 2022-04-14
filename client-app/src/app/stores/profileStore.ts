import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Pagination, PagingParams } from "../models/pagination";
import { Photo, Profile, ProfileEvent, ProfileFormValues } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    // Followings
    followings: Profile[] = [];
    loadingFollowings: boolean = false;
    activeTab: string | number | undefined = undefined;
    // Events
    eventsRegistry = new Map<string, ProfileEvent>();
    loadingEvents: boolean = false;
    activeEventsTab: string | number | undefined;
    pagingParams: PagingParams = new PagingParams(1,4);
    predicate = new Map().set('IsFuture',true);
    pagination: Pagination | null = null;

    constructor() {
        makeAutoObservable(this);

        reaction(() => this.activeTab, activeTab => {
            if (activeTab && (activeTab === 3 || activeTab === 4)) {
                const predicate = activeTab === 3 ? 'followers' : 'following'
                this.loadFollowings(predicate)
            } else if (activeTab && activeTab === 2) {
                this.setActiveEventsTab(0);
            } else {
                this.followings = [];
            }
        })

        reaction(() => this.activeEventsTab, activeEventsTab => {
            if(activeEventsTab === 0 || activeEventsTab === 1 || activeEventsTab === 2) {
                this.loadEvents();
                window.scrollTo(0,0);
            } else {
                //this.events = [];
                this.eventsRegistry.clear();
            }
        })

        reaction(
            // When a filter is updated
            () => this.activeEventsTab,
            () => {
                // Start over with pagination
                this.pagingParams = new PagingParams(1,4);
                // Remove the stored activities
                this.eventsRegistry.clear();
                // Load the new filtered activities
                this.loadEvents();
            }
        )
    }

    setActiveTab = (activeTab: string | number | undefined) => {
        this.activeTab = activeTab;
    }

    setActiveEventsTab = (activeEventsTab: string | number | undefined) => {
        this.activeEventsTab = activeEventsTab;
    }

    setPagingParams = (params: PagingParams) => {
        this.pagingParams = params
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

    loadEvents = async () => {
        this.loadingEvents = true;
        try {
            const result = await agent.Profiles.listEvents(this.profile!.username, this.axiosParams);
            runInAction(() => {
                result.data.forEach((event) => {
                    this.eventsRegistry.set(event.id,event);
                })
                //console.log(this.events);
                this.pagination = result.pagination;
                //console.log(this.pagination);
                this.loadingEvents = false;
            })
        } catch (error) {
            runInAction(() => this.loadingEvents = false);
            console.log(error);
        }
    }

    get events() {
        if(this.activeEventsTab === 0)
            return Array.from(this.eventsRegistry.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        else
            return Array.from(this.eventsRegistry.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        // return Object.entries(
        //     this.activitiesByDate.reduce((activities, activity) => {
        //         const date = format(activity.date, 'dd MMM yyyy');
        //         activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        //         return activities;
        //     }, {} as { [key: string]: Activity[] })
        // )
    }

    setPredicate = (tabIndex: number) => {
        const resetPredicate = () => {
            this.predicate.forEach((value,key) => {
                this.predicate.delete(key);
            })
        }
        this.setActiveEventsTab(tabIndex);
        switch (tabIndex) {
            case 0 :
                resetPredicate();
                this.predicate.set('isFuture',true);
                break;
            case 1 :
                resetPredicate();
                this.predicate.set('isPast',true);
                break;
            case 2 :
                resetPredicate();
                this.predicate.set('isHosting',true);
                break;
        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value,key) => {
            if(key === 'startDate') {
                params.append(key,(value as Date).toISOString());
            } else {
                params.append(key,value);
            }
        })
        return params;
    }
}