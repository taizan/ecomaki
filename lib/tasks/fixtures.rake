namespace "db" do
  namespace "fixtures" do
    task :load do
      # Copy character images.
      src = Rails.root.join('test/fixtures/images/characters/*')
      dst = Rails.root.join('data/images/characters/')
      `cp #{src} #{dst}`

      # Copy background images.
      src = Rails.root.join('test', 'fixtures', 'images', 'background', '*')
      dst = Rails.root.join('data', 'images', 'background')
      `cp #{src} #{dst}`

      # Copy background musics.
      src = Rails.root.join('test', 'fixtures', 'musics', 'background', '*')
      dst = Rails.root.join('data', 'musics', 'background')
      `cp #{src} #{dst}`
    end
  end
end
