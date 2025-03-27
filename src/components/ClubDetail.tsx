import Link from "next/link";
import { Skeleton } from "./skeleton/skeleton";
import ClubInterface from "@/interfaces/Club";
import { useState } from "react";
import { ArrowLeft, CircleChevronRight, CircleChevronDown } from 'lucide-react';

export default function ClubDetail({ club }: { club: ClubInterface | null }) {
    const [isVisible, setIsVisible] = useState(true);
    const toggleVisibility = () => {
        setIsVisible(prevState => !prevState);
    };

    return (

        <div className="space-y-6">
            <div className="space-y-1">
                <p className="text-sm">Club ID</p>
                {club ? (
                    <p className="text-2xl text-bold text-green-300">{club.clubCode}</p>
                ) : (
                    <Skeleton className="h-[40px] w-[300px] bg-green-800" />
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm">ชื่อชมรม</p>
                {club ? (
                    <p className="text-2xl text-bold text-green-300">{club.clubName}</p>
                ) : (
                    <Skeleton className="h-[40px] w-[300px] bg-green-800" />
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm">วิทยาเขต</p>
                {club ? (
                    <p className="text-2xl text-bold text-green-300">{club.campus}</p>
                ) : (
                    <Skeleton className="h-[40px] w-[300px] bg-green-800" />
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm">ประเภทชมรม</p>
                {club ? (
                    <p className="text-xl text-bold text-green-300">{club.clubType}</p>
                ) : (
                    <Skeleton className="h-[40px] w-[300px] bg-green-800" />
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm">ประธานชมรม</p>
                {club ? (
                    <p className="text-xl text-bold text-green-300">{club.clubPresident}</p>
                ) : (
                    <Skeleton className="h-[40px] w-[300px] bg-green-800" />
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm">ที่ปรึกษา</p>
                {club ? (
                    <p className="text-xl text-bold text-green-300">{club.advisor}</p>
                ) : (
                    <Skeleton className="h-[40px] w-[300px] bg-green-800" />
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm">คณะกรรมการ
                    <button
                        className="ms-1 text-sm align-middle"
                        onClick={toggleVisibility}
                    >
                        {isVisible ? (
                            <CircleChevronDown className="h-4 w-4" />
                        ) : (
                            <CircleChevronRight className="h-4 w-4" />
                        )}
                    </button>
                </p>
                {club ? (
                    <>
                        {isVisible && (
                            <div className="mt-2 space-y-2">
                                {/* Display Committee Members */}
                                {club.committee && club.committee?.length > 0 ? (
                                    <ul className="pl-5 space-y-1">
                                        {club.committee.map((member, index) => (
                                                <li key={index} className="text-sm">
                                                    {member.image ? (<img
                                                        className="w-5 h-5 rounded-full inline me-2"
                                                        src={member.image ? `/images/committee/${member.image}` : ""}
                                                        alt="Rounded avatar"
                                                    />) : ("")}
                                                    {member.name}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                ) : (
                                    <p className="text-sm">ไม่พบข้อมูล</p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <Skeleton className="h-[40px] w-[300px] bg-green-800" />
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm">รายละเอียดชมรม</p>
                {club ? (
                    <p className="text-sm">{club.aboutClub}</p>
                ) : (
                    <Skeleton className="h-[60px] w-[350px] bg-green-800" />
                )}
            </div>

        </div>
    );
}