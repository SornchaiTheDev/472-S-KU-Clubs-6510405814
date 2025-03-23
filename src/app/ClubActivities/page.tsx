"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ActivitySkeleton } from '@/components/skeleton/activity-skeleton';
import { getClubById, getClubActivities } from '../_mocks_/data';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import ClubDetail from '@/components/ClubDetail';
import ActivityList from '@/components/ActivityList';

export default function ClubDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'KUC-2025-001';
  
  useEffect(() => {
    console.log("Club ID from URL:", id);
  }, [id]);
  
  const [loading, setLoading] = useState(true);
  const [clubData, setClubData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);

  // จำลองการโหลดข้อมูล
  useEffect(() => {
    const timer = setTimeout(() => {
      const club = getClubById(id);
      const clubActivities = getClubActivities(id);
      
      setClubData(club);
      setActivities(clubActivities);
      setFilteredActivities(clubActivities);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [id]);

  // ฟังก์ชันสำหรับแปลงวันที่ไทยเป็น Date object
  const parseThaiDate = (thaiDate: string) => {
    const months: Record<string, number> = {
      'มกราคม': 0, 'กุมภาพันธ์': 1, 'มีนาคม': 2, 'เมษายน': 3,
      'พฤษภาคม': 4, 'มิถุนายน': 5, 'กรกฎาคม': 6, 'สิงหาคม': 7,
      'กันยายน': 8, 'ตุลาคม': 9, 'พฤศจิกายน': 10, 'ธันวาคม': 11
    };
    
    const parts = thaiDate.split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);
      
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return new Date();
  };

  // ฟังก์ชันสำหรับกรองและเรียงลำดับกิจกรรม
  useEffect(() => {
    if (!loading) {
      let result = [...activities];
      
      // กรองตามคำค้นหา
      if (searchTerm) {
        result = result.filter(activity =>
          activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // เรียงลำดับตามตัวเลือก
      switch (sortOption) {
        case 'newest':
          result.sort((a, b) => parseThaiDate(b.date).getTime() - parseThaiDate(a.date).getTime());
          break;
        case 'oldest':
          result.sort((a, b) => parseThaiDate(a.date).getTime() - parseThaiDate(b.date).getTime());
          break;
        case 'alphabetical':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'reverseAlphabetical':
          result.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }
      
      setFilteredActivities(result);
    }
  }, [searchTerm, sortOption, activities, loading]);

  if (!clubData && !loading) {
    return <div className="p-6">ไม่พบข้อมูลชมรม</div>;
  }

  // แปลงข้อมูลชมรมให้เข้ากับรูปแบบที่ ClubDetail ต้องการ
  const clubForDetail = clubData ? {
    id: clubData.id,
    clubName: clubData.clubName,
    clubType: clubData.clubType,
    campus: clubData.campus,
    clubPresident: clubData.clubPresident,
    advisor: clubData.advisor,
    aboutClub: clubData.aboutClub
  } : null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - Club Detail */}
      {loading ? (
        <div className="w-full md:w-80 lg:w-96 bg-green-800 text-white p-4 md:sticky md:top-0 md:h-screen md:overflow-y-auto shrink-0">
          <div className="space-y-4">
            {/* Skeleton loaders */}
            <div className="h-4 w-16 mb-2 bg-green-700 animate-pulse rounded"></div>
            <div className="h-6 w-24 bg-green-700 animate-pulse rounded"></div>
          </div>
        </div>
      ) : (
        <div className="w-full md:w-80 lg:w-96 bg-green-800 text-white md:sticky md:top-0 md:h-screen md:overflow-y-auto shrink-0">
          <ClubDetail club={clubForDetail} />
        </div>
      )}
        
      {/* Main content - Club Activities */}
      <div className="flex-1 p-4 md:p-6 md:overflow-y-auto">
        {loading ? (
          <>
            {/* Skeleton for banner */}
            <div className="w-full h-40 md:h-48 rounded-lg mb-4 md:mb-6 bg-gray-200 animate-pulse"></div>
            
            {/* Skeleton for heading */}
            <div className="h-8 w-48 mb-4 md:mb-6 bg-gray-200 animate-pulse rounded"></div>
            
            {/* Skeleton for tabs */}
            <div className="mb-4 md:mb-6">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded flex-shrink-0"></div>
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded flex-shrink-0"></div>
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded flex-shrink-0"></div>
              </div>
            </div>
            
            {/* Skeleton for activities */}
            <ActivitySkeleton />
            <ActivitySkeleton />
          </>
        ) : (
          <>
            <div className="w-full h-32 md:h-48 bg-gray-200 rounded-lg overflow-hidden relative mb-4 md:mb-6">
              <Image
                src={`/images/clubs/${clubData?.id || 'default'}-banner.jpg`}
                alt={`${clubData?.clubName || 'Club'} Banner`}
                fill
                className="object-cover"
                onError={(e) => {
                  // @ts-ignore
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/default-banner.jpg";
                }}
              />
            </div>
            
            <h1 className="text-xl md:text-2xl font-bold mb-2">กิจกรรมทั้งหมดของชมรม</h1>
            <p className="text-sm md:text-base text-gray-600 mb-4">นี่คือกิจกรรมหรืออีเวนต์ต่าง ๆ ภายในชมรมที่กำลังจะจัดขึ้น สามารถเลือกเข้าร่วมกิจกรรมที่คุณสนใจได้เลย!</p>
            
            {/* ส่วนค้นหาและเรียงลำดับ */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4 md:mb-6">
              <Input
                placeholder="ค้นหากิจกรรม..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="เรียงลำดับตาม" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">ล่าสุด</SelectItem>
                  <SelectItem value="oldest">เก่าสุด</SelectItem>
                  <SelectItem value="alphabetical">ตามตัวอักษร A-Z</SelectItem>
                  <SelectItem value="reverseAlphabetical">ตามตัวอักษร Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* แท็บกิจกรรม */}
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-4 bg-gray-50 overflow-x-auto flex w-full border-b border-gray-200">
                <TabsTrigger value="upcoming" className="flex-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-800">กำลังจะมาถึง</TabsTrigger>
                <TabsTrigger value="ongoing" className="flex-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-800">กำลังดำเนินการ</TabsTrigger>
                <TabsTrigger value="past" className="flex-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-800">ผ่านมาแล้ว</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <ActivityList activities={filteredActivities} status="upcoming" />
              </TabsContent>
              
              <TabsContent value="ongoing">
                <ActivityList activities={filteredActivities} status="ongoing" />
              </TabsContent>
              
              <TabsContent value="past">
                <ActivityList activities={filteredActivities} status="past" />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}