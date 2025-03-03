import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import './projects.css'
import { CiTrash } from 'react-icons/ci'
import { IoMailOutline } from 'react-icons/io5'
import { JobData } from '../../api/jobsApi'
import FreelancerCard, {
  freelancerInfo
} from 'components/FreelancerCard/FreelancerCard'
import { useTranslation } from 'react-i18next'
import api from 'api'
import { AuthContext } from 'context/authContext'
import { AuthContextProps } from 'interfaces/autContextInterface'
import FreelancerSkillCards from 'components/FreelancerSkillCards/FreelancerSkillCards'

const initialState: JobData = {
  id: '',
  title: '',
  description: '',
  hard_skills: '',
  amount: 0
}

function Projects() {
  const { t } = useTranslation()
  const params = useParams<{ id: string }>()
  const { currentUser } = useContext(AuthContext) as AuthContextProps
  const [isSearchFreelancers, setIsSearchFreelancers] = useState(false)
  const [isAddFreelancers, setIsAddFreelancers] = useState(false)
  const [data, setData] = useState<JobData>(initialState as JobData)
  const [freelaSkill, setFreelaSkill] = useState([])
  const [jobId, setJobId] = useState('')
  const [freelancerIds, setFreelancerIds] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post(`/company/${params.id}/job`, data, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`
        }
      })

      setData({
        id: '',
        title: '',
        description: '',
        hard_skills: '',
        amount: 0
      })
      setJobId(res.data.id)
      const response = await api.get(
        `/company/${params.id}/findSkills/${res.data.id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`
          }
        }
      )
      const freelancers = response.data.map((item: any) => item.freelancer_id)

      setFreelancerIds(freelancers)
      setFreelaSkill(response.data)
      setIsSearchFreelancers(!isSearchFreelancers)
    } catch (error) {
      console.error('Error to send new Project', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleAddFreelancers = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    const jobFreelancers = freelaSkill.map((freelancer) => ({
      name: freelancer.name,
      img: freelancer.img,
      freelancer_id: freelancer.freelancer_id,
      hard_skills: freelancer.hard_skills,
      job_id: jobId
    }))

    try {
      await api.post(`/company/${params.id}/match/${jobId}`, jobFreelancers, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`
        }
      })
    } catch (error) {
      console.error(error)
    }
    setIsAddFreelancers(!isAddFreelancers)
    setIsSearchFreelancers(!isSearchFreelancers)
  }

  return (
    <div className="mt-24 w-full bg-teal400 p-4">
      <div className="container mx-auto rounded-lg border-2 border-white bg-teal400">
        <section className="">
          <form className="px-4 pb-4">
            <main
              className="bg-gray-300 grid h-[900px] grid-flow-col-dense 
                      grid-cols-12 grid-rows-6
                      gap-4 rounded-lg text-center
                      "
            >
              <header className="col-span-12 row-span-1 flex w-full flex-wrap content-center justify-center border-b-2 border-white">
                <p className="p-title-Projects text-center text-5xl font-black text-white drop-shadow-lg">
                  {t('app.projects.title')}
                </p>
              </header>

              <div className="col-span-4 row-span-1 self-center pl-10">
                <label htmlFor="" className="label-Projects text-xl">
                  {t('app.projects.name')}
                </label>
                <input
                  className="w-full rounded-lg p-3"
                  placeholder={t('app.projects.placeholders.name') ?? ''}
                  type="text"
                  onChange={handleChange}
                  name="title"
                  value={data.title}
                />
              </div>
              <div className="col-span-4 row-span-1 self-center rounded-lg pl-10">
                <label htmlFor="" className="label-Projects text-xl">
                  {t('app.projects.skills')}
                </label>
                <input
                  className="rouded-lg w-full rounded-lg p-3"
                  placeholder={t('app.projects.placeholders.skills') ?? ''}
                  type="text"
                  onChange={handleChange}
                  name="hard_skills"
                  value={data.hard_skills}
                />
              </div>
              <div className="col-span-4 row-span-1 self-center pl-10">
                <label htmlFor="" className="label-Projects text-xl">
                  {t('app.projects.quantity')}
                </label>
                <input
                  className="rouded-lg w-full rounded-lg p-3"
                  placeholder="{t('app.projects.placeholders.flquantity') ?? ''}"
                  type="text"
                  onChange={handleChange}
                  name="amount"
                  value={data.amount}
                />
              </div>
              <div className="col-span-4 row-span-3 rounded-lg pl-20">
                <label
                  htmlFor=""
                  className="label-Projects flex content-center justify-center pt-7 text-center text-xl"
                >
                  {t('app.projects.description')}
                </label>
                <textarea
                  className="rouded-lg h-3/4 w-full scroll-smooth rounded-lg p-3"
                  placeholder={t('app.projects.placeholders.description') ?? ''}
                  onChange={handleChange}
                  name="description"
                  value={data.description}
                />
              </div>
              <div className="col-span-4 row-span-3 flex flex-col place-content-center gap-16">
                <div className="">
                  <button
                    className="button disabled w-80 cursor-not-allowed rounded-full p-5 shadow-lg"
                    onClick={handleSubmit}
                  >
                    {t('app.projects.btnsave')}
                  </button>
                </div>
                <div className="">
                  <button className="button rounded-full p-5 px-20 shadow-lg">
                    {t('app.projects.btndelete')}
                  </button>
                </div>
              </div>
              {isAddFreelancers ? (
                <div className="col-span-12 row-span-2 flex w-full justify-center overflow-y-scroll rounded-lg bg-emerald  p-4">
                  <table className="w-full table-auto">
                    <thead className="text-lg">
                      <tr>
                        <th>Nome</th>
                        <th>Habilidades</th>
                        <th className="flex justify-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {freelaSkill.map((info, index) => (
                        <tr key={index}>
                          <td>{info.name}</td>
                          <td>{info.skill}</td>
                          <td className="flex  w-full justify-evenly">
                            <button className="hover:dropshadow-lg rounded-full p-2 text-white hover:bg-teal400/90">
                              <IoMailOutline size={25} />
                            </button>
                            <button className="hover:dropshadow-lg rounded-full p-2 text-white hover:bg-orange/90">
                              <CiTrash size={25} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </main>
          </form>
        </section>
        {isSearchFreelancers ? (
          <section className="p-4">
            <div className="rounded-lg bg-sky p-4">
              <div className="flex w-full flex-wrap justify-center p-4">
                <button className="button mb-4 flex rounded-full p-5 px-20 shadow-lg">
                  {t('app.projects.btnsearch')}
                </button>
              </div>
              <div className="md:items-center, md:justify-certer flex flex-col items-center justify-center gap-2  py-3 md:flex-row">
                {freelaSkill.map((freelancer, index) => (
                  <FreelancerSkillCards
                    key={index}
                    image={freelancer.img}
                    name={freelancer.name}
                    skill={freelancer.hard_skills}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-row items-center justify-evenly gap-16 pb-6 pt-10">
              <div className="">
                <button className="button p-5 px-24 shadow-lg">
                  {t('app.projects.btncancel')}
                </button>
              </div>
              <div className="">
                <button
                  className="button p-5 px-10 shadow-lg"
                  onClick={handleAddFreelancers}
                >
                  {t('app.projects.btnaddfreelancers')}
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default Projects
