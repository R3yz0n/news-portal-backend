"use strict";
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // 1. Upload image(s) to Cloudinary and insert into fileuploads
      const imagesDir = path.join(__dirname, "images");
      let imageFiles = fs.readdirSync(imagesDir);
      // Exclude companylogo.png
      imageFiles = imageFiles.filter((f) => f !== "companylogo.png");

      // Store fileuploads IDs for use in posts
      const fileUploadIds = [];

      for (const imageFile of imageFiles) {
        const imagePath = path.join(imagesDir, imageFile);
        const fileStats = fs.statSync(imagePath);
        const fileSize = fileStats.size;
        const fileType = path.extname(imageFile).replace(".", "");

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(imagePath, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });

        // Insert into fileuploads table
        const fileUploadResult = await queryInterface.bulkInsert(
          "fileuploads",
          [
            {
              name: uploadResult.public_id,
              size: fileSize.toString(),
              type: fileType,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ],
          { returning: true },
        );

        // Save the ID for use in posts (handle all possible return types)
        let fileUploadId = 1;
        if (Array.isArray(fileUploadResult) && fileUploadResult[0] && fileUploadResult[0].id) {
          fileUploadId = fileUploadResult[0].id;
        } else if (fileUploadResult && fileUploadResult.id) {
          fileUploadId = fileUploadResult.id;
        } else if (typeof fileUploadResult === "number") {
          fileUploadId = fileUploadResult;
        }
        fileUploadIds.push(fileUploadId);
      }

      // Map each post to a specific image by index
      const posts = [
        {
          title: "रवि लामिछानेले गृह मन्त्रालय गुमाएपछि आक्रोश पोखे",
          body: "<p>राष्ट्रिय स्वतन्त्र पार्टीका सभापति रवि लामिछानेले गृह मन्त्रालयबाट हटाइएपछि पार्टी कार्यालयमा पत्रकार सम्मेलन गर्दै सरकारको निर्णयलाई 'तानाशाही' भनेका छन्। उनले यो कदमले लोकतन्त्रलाई कमजोर बनाउने दाबी गरे। विपक्षी दलहरूले पनि यसलाई राजनीतिक प्रतिशोधको रूपमा लिएका छन्।</p>",
          author: "John Reporter",
          user_id: 1,
          status: "published",
          category_id: 1,
          is_mukhya_samachar: true,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "International: Summit Yields New Trade Agreement",
          body: "<p>Leaders from neighboring countries concluded a two-day summit by signing a trade agreement to lower tariffs and boost regional cooperation. Economic ministers said the deal will benefit exporters and strengthen supply chains across the region.</p>",
          author: "John Reporter",
          user_id: 2,
          status: "published",
          category_id: 1,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "नेपालमा प्रेस स्वतन्त्रतामाथि आक्रमण बढ्दो",
          body: "<p>विभिन्न अन्तर्राष्ट्रिय संस्थाहरूले नेपालमा पत्रकारहरूमाथि बढ्दो दबाब र निर्वासनको घटनालाई चिन्ताजनक भनेका छन्। पछिल्लो समय सामाजिक सञ्जाल सम्बन्धी नियमहरूले स्वतन्त्र अभिव्यक्तिलाई सीमित गरेको आरोप लागेको छ। पत्रकारहरूले प्रदर्शन गर्दै सरकारसँग संरक्षण मागेका छन्।</p>",
          author: "John Reporter",
          user_id: 3,
          status: "published",
          category_id: 1,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "जेन जेड प्रदर्शन: युवाहरूले सरकारविरुद्ध ठूलो भीड जुटाए",
          body: "<p>काठमाडौंमा युवा पुस्ताले भ्रष्टाचार र सामाजिक सञ्जाल प्रतिबन्धविरुद्ध ठूलो प्रदर्शन गरेका छन्। हजारौं युवा सडकमा उत्रिएपछि सुरक्षा फोर्स तैनाथ गरिएको छ। प्रदर्शनकारीहरूले सामूहिक राजीनामा मागेका छन्।</p>",
          author: "John Reporter",
          user_id: 4,
          status: "published",
          category_id: 1,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "काठमाडौंको ट्राफिक समस्या तीव्र हुदैछ",
          body: "<p>काठमाडौं उपत्यकामा सवारी जाम निकै बढेको छ। सानो र्‍याली वा चाडपर्वले पनि घण्टौं जाम हुने गरेको छ। यातायात व्यवस्था र सडक विस्तारको कमीले समस्या झन् बढाएको छ। स्थानीयहरूले वैकल्पिक समाधान मागेका छन्।</p>",
          author: "John Reporter",
          user_id: 5,
          status: "published",
          category_id: 1,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "ट्रम्पको 'Board of Peace' प्रस्तावमा UN को आपत्ति",
          body: "<p>संयुक्त राष्ट्रसंघका अधिकारीहरूले अमेरिकी पूर्वराष्ट्रपति डोनाल्ड ट्रम्पद्वारा प्रस्तावित 'Board of Peace' लाई बहुपक्षीय संस्थाहरूलाई कमजोर बनाउने प्रयास भनेका छन्। वाशिंगटनमा हुने बैठकमा यो विषय छलफल हुँदैछ। नेपालजस्ता साना राष्ट्रहरूले यसले विश्व शान्ति संरचनालाई असर पार्न सक्ने चिन्ता व्यक्त गरेका छन्।</p>",
          author: "John Reporter",
          user_id: 1,
          status: "published",
          category_id: 2,
          is_mukhya_samachar: true,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "भारत-चीन सीमा सम्झौतापछि नेपालको कडा विरोध",
          body: "<p>भारत र चीनबीच लिपुलेक क्षेत्र सम्बन्धी भएको सम्झौतापछि नेपाल सरकार र सबै प्रमुख दलहरूले एक स्वरमा विरोध गरेका छन्। यो नेपालको सार्वभौमसत्तामाथिको हस्तक्षेप भएको भन्दै कूटनीतिक नोट तयार पारिएको छ। यसले दक्षिण एसियाली क्षेत्रमा तनाव बढाउने आशंका गरिएको छ।</p>",
          author: "John Reporter",
          user_id: 2,
          status: "published",
          category_id: 2,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "UN महासभामा जलवायु परिवर्तन र शान्तिका मुद्दा",
          body: "<p>संयुक्त राष्ट्रसंघको महासभामा विश्व नेताहरूले जलवायु परिवर्तन, युद्ध र UN सुधारका विषयमा छलफल गरेका छन्। नेपालका प्रतिनिधिले विकासशील देशहरूका लागि थप अनुकूलन सहयोगको माग गरेका छन्। बैठकले नयाँ वैश्विक सम्झौताको आधार तयार पार्ने अपेक्षा गरिएको छ।</p>",
          author: "John Reporter",
          user_id: 3,
          status: "published",
          category_id: 2,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "युक्रेन युद्ध: नयाँ शान्ति वार्ताको सम्भावना",
          body: "<p>युक्रेन र रुसबीचको युद्धमा नयाँ शान्ति वार्ताको सम्भावना देखिएको छ। अन्तर्राष्ट्रिय मध्यस्थकर्ताहरूले वार्तालाई अगाडि बढाउन प्रयास गरिरहेका छन्। नेपालले यसलाई क्षेत्रीय स्थिरताका लागि सकारात्मक कदम मानेको छ तर पूर्ण शान्तिको आवश्यकता औंल्याएको छ।</p>",
          author: "John Reporter",
          user_id: 4,
          status: "published",
          category_id: 2,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "दक्षिण एसियामा व्यापार सम्झौता: नेपालको भूमिका",
          body: "<p>दक्षिण एसियाली देशहरूबीच नयाँ व्यापार सम्झौताको चर्चा तीव्र भएको छ। नेपालले यसमा सक्रिय सहभागिता जनाउँदै सन्तुलित व्यापार नीति अपनाउने बताएको छ। यो सम्झौताले क्षेत्रीय आपूर्ति शृंखला र निर्यातलाई फाइदा पुग्ने अपेक्षा गरिएको छ।</p>",
          author: "John Reporter",
          user_id: 5,
          status: "published",
          category_id: 2,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          title: "ट्रम्पको 'Board of Peace' प्रस्तावमा UN को आपत्ति",
          body: "<p>संयुक्त राष्ट्रसंघका अधिकारीहरूले अमेरिकी पूर्वराष्ट्रपति डोनाल्ड ट्रम्पद्वारा प्रस्तावित 'Board of Peace' लाई बहुपक्षीय संस्थाहरूलाई कमजोर बनाउने प्रयास भनेका छन्। वाशिंगटनमा हुने बैठकमा यो विषय छलफल हुँदैछ। नेपालजस्ता साना राष्ट्रहरूले यसले विश्व शान्ति संरचनालाई असर पार्न सक्ने चिन्ता व्यक्त गरेका छन्।</p>",
          author: "John Reporter",
          user_id: 1,
          status: "published",
          category_id: 3,
          is_mukhya_samachar: true,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "भारत-चीन सीमा सम्झौतापछि नेपालको कडा विरोध",
          body: "<p>भारत र चीनबीच लिपुलेक क्षेत्र सम्बन्धी भएको सम्झौतापछि नेपाल सरकार र सबै प्रमुख दलहरूले एक स्वरमा विरोध गरेका छन्। यो नेपालको सार्वभौमसत्तामाथिको हस्तक्षेप भएको भन्दै कूटनीतिक नोट तयार पारिएको छ। यसले दक्षिण एसियाली क्षेत्रमा तनाव बढाउने आशंका गरिएको छ।</p>",
          author: "John Reporter",
          user_id: 2,
          status: "published",
          category_id: 3,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "UN महासभामा जलवायु परिवर्तन र शान्तिका मुद्दा",
          body: "<p>संयुक्त राष्ट्रसंघको महासभामा विश्व नेताहरूले जलवायु परिवर्तन, युद्ध र UN सुधारका विषयमा छलफल गरेका छन्। नेपालका प्रतिनिधिले विकासशील देशहरूका लागि थप अनुकूलन सहयोगको माग गरेका छन्। बैठकले नयाँ वैश्विक सम्झौताको आधार तयार पार्ने अपेक्षा गरिएको छ।</p>",
          author: "John Reporter",
          user_id: 3,
          status: "published",
          category_id: 3,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "युक्रेन युद्ध: नयाँ शान्ति वार्ताको सम्भावना",
          body: "<p>युक्रेन र रुसबीचको युद्धमा नयाँ शान्ति वार्ताको सम्भावना देखिएको छ। अन्तर्राष्ट्रिय मध्यस्थकर्ताहरूले वार्तालाई अगाडि बढाउन प्रयास गरिरहेका छन्। नेपालले यसलाई क्षेत्रीय स्थिरताका लागि सकारात्मक कदम मानेको छ तर पूर्ण शान्तिको आवश्यकता औंल्याएको छ।</p>",
          author: "John Reporter",
          user_id: 4,
          status: "published",
          category_id: 3,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "दक्षिण एसियामा व्यापार सम्झौता: नेपालको भूमिका",
          body: "<p>दक्षिण एसियाली देशहरूबीच नयाँ व्यापार सम्झौताको चर्चा तीव्र भएको छ। नेपालले यसमा सक्रिय सहभागिता जनाउँदै सन्तुलित व्यापार नीति अपनाउने बताएको छ। यो सम्झौताले क्षेत्रीय आपूर्ति शृंखला र निर्यातलाई फाइदा पुग्ने अपेक्षा गरिएको छ।</p>",
          author: "John Reporter",
          user_id: 5,
          status: "published",
          category_id: 3,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "ट्रम्पको 'Board of Peace' प्रस्तावमा UN र युरोपेली देशहरूको आलोचना",
          body: "<p>अमेरिकी राष्ट्रपति डोनाल्ड ट्रम्पद्वारा गाजा युद्ध समाप्तिका लागि प्रस्तावित 'Board of Peace' लाई संयुक्त राष्ट्रसंघका अधिकारीहरू र प्रमुख युरोपेली देशहरूले बहुपक्षीय संस्थाहरूलाई कमजोर बनाउने प्रयास भनेका छन्। वाशिंगटनमा भएको उद्घाटन बैठकमा ठूलो रकमको प्रतिबद्धता भए पनि युरोपेली नेताहरूले भाग नलिने निर्णय गरेका छन्। नेपालजस्ता साना राष्ट्रहरूले यसले वैश्विक शान्ति संरचनालाई असर पार्न सक्ने चिन्ता व्यक्त गरेका छन्।</p>",
          author: "John Reporter",
          user_id: 1,
          status: "published",
          category_id: 4,
          is_mukhya_samachar: true,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "लिपुलेक व्यापार सम्झौतापछि नेपालको निरन्तर विरोध",
          body: "<p>भारत र चीनबीच लिपुलेक पासबाट सीमा व्यापार पुनः सुरु गर्ने समझदारीपछि नेपाल सरकार र प्रमुख दलहरूले फेरि कडा विरोध गरेका छन्। यो नेपालको सार्वभौमसत्तामाथिको हस्तक्षेप भएको भन्दै कूटनीतिक नोट पठाइएको छ। यसले दक्षिण एसियाली क्षेत्रमा तनाव बढाउने र नेपालको सीमा दाबीलाई कमजोर बनाउने आशंका गरिएको छ।</p>",
          author: "John Reporter",
          user_id: 2,
          status: "published",
          category_id: 4,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "UN महासभामा नेपालले जलवायु न्याय र शान्तिको माग",
          body: "<p>संयुक्त राष्ट्रसंघको महासभामा नेपालका प्रतिनिधिले जलवायु परिवर्तनको असमान प्रभाव, हिमाली क्षेत्रको संकट र वैश्विक शान्तिका लागि थप सहयोगको माग गरेका छन्। विकासशील देशहरूका लागि अनुकूलन र उत्सर्जन घटाउने जिम्मेवारीमा जोड दिइएको छ। बैठकले २०३० एजेन्डा र जलवायु कार्यलाई तीव्र पार्ने अपेक्षा गरिएको छ।</p>",
          author: "John Reporter",
          user_id: 3,
          status: "published",
          category_id: 4,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "युक्रेन-रुस शान्ति वार्ता: अमेरिकी दबाब बढ्दै, तर प्रगति न्यून",
          body: "<p>जेनेभामा भएको युक्रेन-रुस शान्ति वार्ताको तेस्रो चरणमा कुनै ठोस प्रगति नभए पनि अमेरिकाले दबाब बढाएको छ। युक्रेनी राष्ट्रपति जेलेन्स्कीले रुसलाई 'ढिलाइ रणनीति' अपनाएको आरोप लगाएका छन्। नेपालले यसलाई क्षेत्रीय स्थिरताका लागि महत्वपूर्ण माने पनि पूर्ण शान्ति र न्यायपूर्ण समाधानको आवश्यकता औंल्याएको छ।</p>",
          author: "John Reporter",
          user_id: 4,
          status: "published",
          category_id: 4,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "दक्षिण एसियाली व्यापार एकीकरण: BIMSTEC मा नेपालको सक्रिय भूमिका",
          body: "<p>SAARC को कमजोरीपछि BIMSTEC लाई दक्षिण एसियाली र दक्षिणपूर्वी एसियाली देशहरूबीच व्यापार र कनेक्टिभिटीको प्रमुख मञ्च बनाउने प्रयास तीव्र भएको छ। नेपालले यसमा सक्रिय सहभागिता जनाउँदै सन्तुलित व्यापार नीति र क्षेत्रीय आपूर्ति शृंखलालाई मजबुत बनाउने बताएको छ। यो सम्झौताले निर्यात र आर्थिक विकासमा फाइदा पुग्ने अपेक्षा छ।</p>",
          author: "John Reporter",
          user_id: 5,
          status: "published",
          category_id: 4,
          is_mukhya_samachar: false,
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      // Assign each post a featured_image_id from fileUploadIds by index
      for (let i = 0; i < posts.length; i++) {
        posts[i].featured_image_id = fileUploadIds[i] || fileUploadIds[0] || 1;
      }

      await queryInterface.bulkInsert("posts", posts, {});
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("posts", null, {});
    await queryInterface.bulkDelete("fileuploads", null, {});
  },
};
