import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { LoaderIcon } from "react-hot-toast";
import { completeOnboarding } from "../lib/api.js";
import { useNavigate } from "react-router";
import {
  CameraIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants/index.js";

const onBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    name: authUser?.name || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profile: authUser?.profile || "",
  });

  const {
    mutate: onboardingMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");

      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    completeOnboarding(formState);
  };

  const handleRandomAvatar = (e) => {
    e.preventDefault();
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profile: randomAvatar });
    toast.success("Avatar changed succesfully");
  };

  return (
    <div>
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="card bg-base-200 w-full max-w-xl  shadow-xl">
          <div className="card-body p-6 sm-p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Complete Your Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* profile pic container */}
              <div className="flex flex-col items-center justify-center space-y-3">
                {/* image preveiw */}
                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                  {formState.profile ? (
                    <img
                      src={formState.profile}
                      alt="profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>
                {/* Generate avatar */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="btn btn-accent"
                    onClick={handleRandomAvatar}
                  >
                    <ShuffleIcon className="size-4 mr-2" />
                    Generate Random Avatar
                  </button>
                </div>
              </div>
              {/* full name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full name</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className="w-full input input-bordered "
                  placeholder="Your full name"
                />
              </div>

              {/* bio */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>

                <textarea
                  name="bio"
                  value={formState.bio}
                  onChange={(e) =>
                    setFormState({ ...formState, bio: e.target.value })
                  }
                  className="textarea textarea-bordered h-24"
                  placeholder="Tell others about yourself and youjr language leraning goals"
                ></textarea>
              </div>

              {/* languages */}
              <div className="grid gird-cols-1 md:grid-cols-2 gap-4">
                {/* nativeLanguage */}
                <div className="from-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        nativeLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select yout native language</option>
                    {LANGUAGES.map((lang) => (
                      <option
                        key={`native${lang}`}
                        value={lang.toLocaleUpperCase()}
                      >
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* learningLanguage */}
                <div className="from-control">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    name="LearningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        learningLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select yout native language</option>
                    {LANGUAGES.map((lang) => (
                      <option
                        key={`learning${lang}`}
                        value={lang.toLocaleUpperCase()}
                      >
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({ ...formState, location: e.target.value })
                    }
                    className="input input-bordered w-full pl-10"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* submit  submit*/}
              <button
                className="btn btn-primary w-full"
                disabled={isPending}
                type="submit"
              >
                {!isPending ? (
                  <>
                    <ShipWheelIcon />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    Onboarding...
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default onBoardingPage;
