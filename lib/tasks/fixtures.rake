namespace "db" do
  namespace "fixtures" do
    task :load do
      src = Rails.root.join('test/fixtures/images/characters/*')
      dst = Rails.root.join('data/images/characters/')
      `cp #{src} #{dst}`
    end
  end
end
