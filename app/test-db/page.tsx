"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TestDB() {
  const [status, setStatus] = useState('Testing...');
  const [spaceCount, setSpaceCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        setStatus('Testing Supabase connection...');
        
        // Test basic spaces table access
        const { count, error: countError } = await supabase
          .from('spaces')
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          setError(`Spaces table error: ${countError.message}`);
          setStatus('❌ Failed to connect to spaces table');
          return;
        }

        setSpaceCount(count || 0);
        
        // Test fetching actual spaces data
        const { data: spacesData, error: spacesError } = await supabase
          .from('spaces')
          .select('id, title, price_per_hour, location')
          .limit(3);
          
        if (spacesError) {
          setError(`Spaces data error: ${spacesError.message}`);
          setStatus('❌ Failed to fetch spaces data');
          return;
        }

        setStatus('✅ Database connected successfully!');
        console.log('Sample spaces:', spacesData);
        
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(`Connection Error: ${errorMsg}`);
        setStatus('❌ Connection failed');
      }
    }

    testConnection();
  }, []);

  return (
    <div className="container mx-auto p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <p className="mb-2"><strong>Status:</strong> {status}</p>
        {spaceCount !== null && (
          <p className="mb-2"><strong>Spaces in database:</strong> {spaceCount}</p>
        )}
        {error && (
          <div className="text-red-400 mt-2">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-400">
        <p>This page tests if your Supabase database is properly connected.</p>
        <p>Environment variables being used:</p>
        <ul className="list-disc list-inside ml-4">
          <li>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
        </ul>
      </div>
    </div>
  );
}