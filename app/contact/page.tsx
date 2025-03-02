'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // フォームバリデーション
    if (!formData.name || !formData.email || !formData.message) {
      setError('必須項目をすべて入力してください');
      setIsSubmitting(false);
      return;
    }
    
    // メール形式の検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('有効なメールアドレスを入力してください');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // 実際のAPI呼び出しをここに実装します
      // 現在はモックで2秒待機後に成功とします
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('送信中にエラーが発生しました。後でもう一度お試しください');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Image
                src="/images/linebuzz-logo.svg"
                alt="LINEBUZZ"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          </Link>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-[#66cdaa] transition-colors">
              ホーム
            </Link>
            <Link href="/features" className="text-gray-600 hover:text-[#66cdaa] transition-colors">
              機能
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-[#66cdaa] transition-colors">
              料金
            </Link>
            <Link href="/contact" className="text-[#66cdaa] font-medium">
              お問い合わせ
            </Link>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-2 text-gray-800"
          >
            お問い合わせ
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-center mb-8 text-gray-600"
          >
            ご質問やご意見がございましたら、お気軽にお問い合わせください。
          </motion.p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
            >
              <h2 className="text-xl font-semibold text-green-800 mb-2">お問い合わせありがとうございます</h2>
              <p className="text-green-700 mb-4">
                内容を確認次第、担当者よりご連絡いたします。
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-2 bg-[#66cdaa] text-white rounded-lg hover:bg-[#5bb799] transition-colors"
              >
                新しいお問い合わせ
              </button>
            </motion.div>
          ) : (
            <motion.form 
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-lg p-6 md:p-8"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66cdaa] transition-all"
                  placeholder="山田 太郎"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66cdaa] transition-all"
                  placeholder="example@email.com"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 mb-2">
                  件名
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66cdaa] transition-all"
                >
                  <option value="">お問い合わせ内容を選択</option>
                  <option value="general">一般的なお問い合わせ</option>
                  <option value="technical">技術的な問題</option>
                  <option value="billing">お支払いについて</option>
                  <option value="partnership">パートナーシップ</option>
                  <option value="other">その他</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  メッセージ <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66cdaa] transition-all"
                  placeholder="お問い合わせ内容をご記入ください"
                ></textarea>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-[#66cdaa] text-white rounded-lg font-medium transition-all ${
                    isSubmitting 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:bg-[#5bb799] hover:shadow-md'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      送信中...
                    </span>
                  ) : '送信する'}
                </button>
              </div>
            </motion.form>
          )}
          
          <motion.div 
            variants={itemVariants}
            className="mt-10 bg-gray-50 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">その他の連絡方法</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-[#66cdaa] p-3 rounded-full text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">メール</h3>
                  <p className="text-gray-600">support@linebuzz.jp</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#66cdaa] p-3 rounded-full text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">電話</h3>
                  <p className="text-gray-600">03-1234-5678（平日10:00-18:00）</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      
      {/* フッター */}
      <footer className="bg-gray-50 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Image
                src="/images/linebuzz-logo.svg"
                alt="LINEBUZZ"
                width={120}
                height={30}
                className="h-8 w-auto"
              />
              <p className="text-gray-600 text-sm mt-2">© {new Date().getFullYear()} LINEBUZZ. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-600 hover:text-[#66cdaa] text-sm">
                利用規約
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-[#66cdaa] text-sm">
                プライバシーポリシー
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#66cdaa] text-sm">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
