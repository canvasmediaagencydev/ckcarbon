"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutUsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <motion.section
      ref={ref}
      id="about"
      className="relative py-12 sm:py-16 lg:py-32 bg-gray-50 overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {/* Palm Leaves */}
        <div
          className="absolute -top-100 right-0 w-200 sm:w-300 h-200 sm:h-300 bg-contain bg-no-repeat opacity-5 sm:opacity-10 md:opacity-20"
          style={{
            backgroundImage: "url('/image/palm-leaves-white-background.svg')",
            backgroundPosition: 'top right'
          }}
        />

        {/* Charcoal Heap */}
        <div
          className="absolute bottom-0 right-0 w-[500px] sm:w-[700px] lg:w-[900px] h-[300px] sm:h-[400px] lg:h-[500px] bg-contain bg-no-repeat opacity-20 sm:opacity-30"
          style={{
            backgroundImage: "url('/image/heap-charcoal-isolated-white-background 1.svg')",
            backgroundPosition: 'bottom right'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            variants={fadeInVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900"
              variants={fadeInVariants}
            >
              About Us
            </motion.h2>

            <motion.div
              className="prose prose-base sm:prose-lg text-gray-700 leading-relaxed"
              variants={fadeInVariants}
            >
              <p className="text-sm sm:text-base">
                has its roots in a family business that once thrived in the coconut industry. In 2004, our founder envisioned the potential of transforming coconut shells into high-quality activated carbon. From that vision, CK Carbon Partnership was officially established, specializing in the production and supply of premium water filtration media, trusted by both households and industries.
              </p>
            </motion.div>

            {/* Thai Content */}
            <motion.div
              className="space-y-4 sm:space-y-6 mt-8 sm:mt-12"
              variants={fadeInVariants}
            >
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                ธุรกิจของ <span className="text-green-600">CK <span className="text-gray-900">CARBON</span></span>
              </h3>

              <div className="text-gray-700 leading-relaxed space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base">
                  เริ่มต้นจากรากฐานครอบครัวที่เคยทำธุรกิจเกี่ยวกับมะพร้าว คุณพ่อของเรามองเห็นคุณค่าและโอกาสในการต่อยอดจาก
                </p>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                  <p className="text-base sm:text-lg">
                    <span className="font-semibold">"กะลามะพร้าว"</span>{" "}
                    <span className="text-green-600 font-semibold">สู่การผลิตถ่านกัมมันต์</span>{" "}
                    <span className="text-gray-600">(Activated Carbon)</span>
                  </p>

                  <p className="mt-3 sm:mt-4 text-gray-700 text-sm sm:text-base">
                    ตั้งแต่ปี 2004 เป็นต้นมา ก่อนจะก่อตั้ง หจก. ซีเคคาร์บอน อย่างเป็นทางการ เพื่อดำเนินธุรกิจด้านการผลิตและจัดจำหน่ายสารกรองน้ำคุณภาพสูง ที่ตอบโจทย์ทั้งภาคครัวเรือนและอุตสาหกรรม
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8"
              variants={fadeInVariants}
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">2004</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">ก่อตั้ง</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">20+</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">ปีประสบการณ์</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">100%</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">ธรรมชาติ</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Visual Element */}
          <motion.div
            className="relative lg:ml-8 mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Main Visual Card */}
              <motion.div
                className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4 sm:space-y-6">
                  {/* Process Flow */}
                  <div className="text-center">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                      Process Transformation
                    </h4>

                    <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                      {/* Coconut Shell */}
                      <motion.div
                        className="flex flex-col items-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-xl sm:text-2xl">🥥</span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-600">Coconut Shell</span>
                      </motion.div>

                      {/* Arrow */}
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-green-500"
                      >
                        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.div>

                      {/* Activated Carbon */}
                      <motion.div
                        className="flex flex-col items-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                          <span className="text-xl sm:text-2xl">⚫</span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-600">Activated Carbon</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Quality Features */}
                  <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-gray-700">High-Quality Filtration</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-gray-700">Eco-Friendly Production</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-gray-700">Industrial & Household Use</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-gray-700">Trusted Partnership</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-green-500/10 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <motion.div
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
