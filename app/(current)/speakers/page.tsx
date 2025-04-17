import { Metadata } from "next";
import { z } from "zod";
import SpeakersView from "./speakersView";

const dataSchema = z.object({
  toBeUpdated: z.boolean(),
  speakers: z.array(
    z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)])
      .or(
        z.tuple([z.string().min(1), z.string().min(1), z.string().min(1), z.string().min(1)])
      )
  ),
});

export type SpeakersProps = z.infer<typeof dataSchema>;

export const metadata: Metadata = {
  title: "Invited speakers | ICCOC2023",
};

const json = {
  "speakers": [
      [
          "Yun-Dong", "Wu", "(Peking University Shenzhen Graduate School, China)"
      ],
      [
          "Peijun", "Hu", "(ShanghaiTech University, China)"
      ],
      [
          "Shubin", "Liu", "(University of North Caroling at Chapel Hill, USA)"
      ],
      [
          "Wei", "Guan", "(Wuhan University, China)"
      ],
      [
          "Xiaotian", "Qi", "(Wuhan University, China)"
      ],
      [
          "Feliu", "Maseras", "(Institute of Chemical Research of Catalonia, Spain)"
      ],
      [
          "Genping", "Huang", "(Tianjin University, China)"
      ],
      [
          "Yunfang", "Yang", "(Zhejiang University of Technology, China)"
      ],
      [
          "Yu", "Lan", "(Zhengzhou University, China)"
      ],
      [
          "Yuanzhi", "Xia", "(Wenzhou University, China)"
      ],
      [
          "Li-Ping", "Xu", "(Shandong University, China)"
      ],
      [
          "Gui-Juan", "Cheng", "(The Chinese University of Hong Kong, Shenzhen, China)"
      ],
      [
          "Li", "Dang", "(Shantou University, China)"
      ],
      [
          "Evert Jan", "Meijer", "(University of Amsterdam, Holland)"
      ],
      [
          "Yanfeng", "Dang", "(Tianjin University, China)"
      ],
      [
          "Gang", "Lu", "(Shandong University, China)"
      ],
      [
          "Shuhua", "Li", "(Nanjing University, China)"
      ],
      [
          "Djamaladdin", "Musaev", "(Emory University, USA)"
      ],
      [
          "Lung Wa", "Chung", "(Southern University of Science and Technology)"
      ],
      [
          "De-Cai", "Fang", "(Beijing Normal University, China)"
      ],
      [
          "Xiao-Song", "Xue", "(Shanghai Institute of Organic Chemistry, CAS, China)"
      ],
      [
          "Lili", "Zhao", "(Nanjing Tech University, China)"
      ],
      [
          "Zhixiang", "Wang", "(University of Chinese Academey of Sciences, China)"
      ],
      [
          "Jiaxi", "Xu", "(Beijing University of Chemical Technology, China)"
      ],
      [
          "Qiang", "Liu", "(Tsinghua University, China)"
      ],
      [
          "Robert", "Morris", "(University of Torento, Canada)"
      ],
      [
          "Fahmi", "Himo", "(Stockholm University, Sweden)"
      ],
      [
          "Zhenyang", "Lin", "(The Hong Kong University of Science and Technology, China)"
      ],
      [
          "Zhi-Xiang", "Yu", "(Peking University, China)"
      ],
      [
          "Paul W.", "Ayers", "(McMaster University, USA)"
      ],
      [
          "Agusti", "Lledos", "(Universitat Automoma de Barcelona, Spain)"
      ],
      [
          "Qian", "Peng", "(Nankai University, China)"
      ],
      [
          "Xin", "Xu", "(Fudan University, China)"
      ],
      [
          "Xin", "Hong", "(Zhejiang University, China)"
      ],
      [
          "Zhuofeng", "Ke", "(Sun-Yat-sen University, China)"
      ],
      [
          "Jing", "Ma", "(Nanjing University, China)"
      ],
      [
          "Linjiang", "Chen", "(University of Bermingham, UK)"
      ],
      [
          "Nguyen", "Bao", "(University of Leeds, UK)"
      ],
      [
          "Jun", "Li", "(Tsinghua University, China)"
      ],
      [
          "Jinlan", "Wang", "(Southeast University, China)"
      ],
      [
          "Xue-Lu", "Ma", "(China University of Mining and Technology, Beijing, China)"
      ],
      [
          "Shixuan", "Du", "(Institute of Phusics, CAS, China)"
      ],
      [
          "Yafei", "Li", "(Nanjing Normal University, China)"
      ],
      [
          "Rong-Zhen", "Liao", "(Huazhong University of Science and Technology, China)"
      ],
      [
          "Zhanfeng", "Wang", "(Beijing Normal University, China)"
      ],
      [
          "Yanli", "Zeng", "(Hebei Normal University, China)"
      ],
      [
          "Xuebo", "Chen", "(Beijing Normal University, China)"
      ],
      [
          "Xiaoguang", "Bao", "(Soochew University, China)"
      ],
      [
          "Xiang-ai", "Yuan", "(Qufu Normal University)"
      ],
      [
          "Odile", "Eisenstein", "(Universite Montpellier, France)"
      ],
      [
          "Li-Zhu", "Wu", "(Technical Institute of Physics and Chemistry, CAS, China)"
      ]
  ],
  "toBeUpdated": false
} as SpeakersProps

export default function SpeakersPage() {
  return <SpeakersView {...json}></SpeakersView>;
}
